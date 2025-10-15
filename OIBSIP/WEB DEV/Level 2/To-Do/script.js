class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentEditId = null;
        this.initializeElements();
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
    }

    initializeElements() {
        // Forms and inputs
        this.taskForm = document.getElementById('task-form');
        this.taskInput = document.getElementById('task-input');
        this.prioritySelect = document.getElementById('priority-select');
        this.categorySelect = document.getElementById('category-select');
        
        // Edit modal
        this.editModal = document.getElementById('edit-modal');
        this.editForm = document.getElementById('edit-task-form');
        this.editInput = document.getElementById('edit-task-input');
        this.editPrioritySelect = document.getElementById('edit-priority-select');
        this.editCategorySelect = document.getElementById('edit-category-select');
        
        // Task lists
        this.pendingTasksList = document.getElementById('pending-tasks-list');
        this.completedTasksList = document.getElementById('completed-tasks-list');
        
        // Filters and controls
        this.filterSelect = document.getElementById('filter-select');
        this.categoryFilter = document.getElementById('category-filter');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        this.clearAllBtn = document.getElementById('clear-all');
        
        // Stats
        this.totalTasksElement = document.getElementById('total-tasks');
        this.pendingTasksElement = document.getElementById('pending-tasks');
        this.completedTasksElement = document.getElementById('completed-tasks');
        this.pendingCountElement = document.getElementById('pending-count');
        this.completedCountElement = document.getElementById('completed-count');
        
        // Modal buttons
        this.closeModalBtn = document.querySelector('.close-modal');
        this.cancelEditBtn = document.getElementById('cancel-edit');
    }

    bindEvents() {
        // Form submissions
        this.taskForm.addEventListener('submit', (e) => this.handleAddTask(e));
        this.editForm.addEventListener('submit', (e) => this.handleEditTask(e));
        
        // Filter changes
        this.filterSelect.addEventListener('change', () => this.renderTasks());
        this.categoryFilter.addEventListener('change', () => this.renderTasks());
        
        // Action buttons
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompletedTasks());
        this.clearAllBtn.addEventListener('click', () => this.clearAllTasks());
        
        // Modal events
        this.closeModalBtn.addEventListener('click', () => this.closeEditModal());
        this.cancelEditBtn.addEventListener('click', () => this.closeEditModal());
        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) this.closeEditModal();
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeEditModal();
        });
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getCurrentDateTime() {
        const now = new Date();
        return {
            date: now.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            }),
            time: now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            timestamp: now.getTime()
        };
    }

    handleAddTask(e) {
        e.preventDefault();
        
        const taskText = this.taskInput.value.trim();
        if (!taskText) return;

        const newTask = {
            id: this.generateId(),
            text: taskText,
            priority: this.prioritySelect.value,
            category: this.categorySelect.value,
            completed: false,
            createdAt: this.getCurrentDateTime(),
            completedAt: null
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        
        // Reset form
        this.taskForm.reset();
        this.taskInput.focus();
        
        // Show success animation
        this.showSuccessMessage('Task added successfully!');
    }

    handleEditTask(e) {
        e.preventDefault();
        
        const taskText = this.editInput.value.trim();
        if (!taskText || !this.currentEditId) return;

        const taskIndex = this.tasks.findIndex(task => task.id === this.currentEditId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex].text = taskText;
            this.tasks[taskIndex].priority = this.editPrioritySelect.value;
            this.tasks[taskIndex].category = this.editCategorySelect.value;
            
            this.saveTasks();
            this.renderTasks();
            this.closeEditModal();
            
            this.showSuccessMessage('Task updated successfully!');
        }
    }

    toggleTaskCompletion(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? this.getCurrentDateTime() : null;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.currentEditId = taskId;
            this.editInput.value = task.text;
            this.editPrioritySelect.value = task.priority;
            this.editCategorySelect.value = task.category;
            this.openEditModal();
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showSuccessMessage('Task deleted successfully!');
        }
    }

    openEditModal() {
        this.editModal.classList.add('active');
        this.editInput.focus();
    }

    closeEditModal() {
        this.editModal.classList.remove('active');
        this.currentEditId = null;
        this.editForm.reset();
    }

    clearCompletedTasks() {
        if (confirm('Are you sure you want to clear all completed tasks?')) {
            this.tasks = this.tasks.filter(task => !task.completed);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showSuccessMessage('Completed tasks cleared!');
        }
    }

    clearAllTasks() {
        if (confirm('Are you sure you want to clear ALL tasks? This action cannot be undone.')) {
            this.tasks = [];
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showSuccessMessage('All tasks cleared!');
        }
    }

    getFilteredTasks() {
        const statusFilter = this.filterSelect.value;
        const categoryFilter = this.categoryFilter.value;
        
        return this.tasks.filter(task => {
            const statusMatch = statusFilter === 'all' || 
                              (statusFilter === 'pending' && !task.completed) ||
                              (statusFilter === 'completed' && task.completed);
            
            const categoryMatch = categoryFilter === 'all' || task.category === categoryFilter;
            
            return statusMatch && categoryMatch;
        });
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        const pendingTasks = filteredTasks.filter(task => !task.completed);
        const completedTasks = filteredTasks.filter(task => task.completed);

        this.renderTaskList(this.pendingTasksList, pendingTasks, false);
        this.renderTaskList(this.completedTasksList, completedTasks, true);
        
        this.updateEmptyStates();
    }

    renderTaskList(container, tasks, isCompleted) {
        container.innerHTML = '';

        if (tasks.length === 0) {
            const emptyState = this.createEmptyState(isCompleted);
            container.appendChild(emptyState);
            return;
        }

        tasks.forEach(task => {
            const taskElement = this.createTaskElement(task, isCompleted);
            container.appendChild(taskElement);
        });
    }

    createEmptyState(isCompleted) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        
        if (isCompleted) {
            emptyState.innerHTML = `
                <i class="fas fa-trophy"></i>
                <p>No completed tasks yet. Complete some tasks to see them here!</p>
            `;
        } else {
            emptyState.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>No pending tasks! Add a new task to get started.</p>
            `;
        }
        
        return emptyState;
    }

    createTaskElement(task, isCompleted) {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${isCompleted ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <div class="task-header">
                <div class="task-text">${this.escapeHtml(task.text)}</div>
            </div>
            <div class="task-meta">
                <span class="task-priority ${task.priority}">${task.priority.toUpperCase()}</span>
                <span class="task-category">${task.category}</span>
                <span class="task-date">
                    ${isCompleted ? 'Completed: ' + task.completedAt.date : 'Added: ' + task.createdAt.date}
                </span>
            </div>
            <div class="task-actions">
                ${isCompleted ? 
                    `<button class="task-btn btn-undo" onclick="app.toggleTaskCompletion('${task.id}')">
                        <i class="fas fa-undo"></i>Undo
                    </button>` :
                    `<button class="task-btn btn-complete" onclick="app.toggleTaskCompletion('${task.id}')">
                        <i class="fas fa-check"></i>Complete
                    </button>`
                }
                <button class="task-btn btn-edit" onclick="app.editTask('${task.id}')">
                    <i class="fas fa-edit"></i>Edit
                </button>
                <button class="task-btn btn-delete" onclick="app.deleteTask('${task.id}')">
                    <i class="fas fa-trash"></i>Delete
                </button>
            </div>
        `;
        
        return taskElement;
    }

    updateStats() {
        const totalTasks = this.tasks.length;
        const pendingTasks = this.tasks.filter(task => !task.completed).length;
        const completedTasks = this.tasks.filter(task => task.completed).length;

        this.totalTasksElement.textContent = totalTasks;
        this.pendingTasksElement.textContent = pendingTasks;
        this.completedTasksElement.textContent = completedTasks;
        this.pendingCountElement.textContent = pendingTasks;
        this.completedCountElement.textContent = completedTasks;
    }

    updateEmptyStates() {
        // This method ensures empty states are shown correctly when filters are applied
        const pendingTasks = this.tasks.filter(task => !task.completed);
        const completedTasks = this.tasks.filter(task => task.completed);
        
        if (pendingTasks.length === 0 && this.pendingTasksList.querySelector('.task-item') === null) {
            this.pendingTasksList.innerHTML = '';
            this.pendingTasksList.appendChild(this.createEmptyState(false));
        }
        
        if (completedTasks.length === 0 && this.completedTasksList.querySelector('.task-item') === null) {
            this.completedTasksList.innerHTML = '';
            this.completedTasksList.appendChild(this.createEmptyState(true));
        }
    }

    showSuccessMessage(message) {
        // Create temporary success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;
        successMsg.textContent = message;
        document.body.appendChild(successMsg);

        setTimeout(() => {
            successMsg.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(successMsg);
            }, 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Local Storage Methods
    saveTasks() {
        localStorage.setItem('todoAppTasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('todoAppTasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    }
}

// Add CSS for success message animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();
});

// Make app globally available for onclick handlers
window.app = app;