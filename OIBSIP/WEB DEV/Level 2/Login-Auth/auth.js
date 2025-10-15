class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.sessionTimer = null;
        this.sessionDuration = 30 * 60 * 1000; // 30 minutes
        this.initializeApp();
    }

    initializeApp() {
        this.checkAuthentication();
        this.setupEventListeners();
        this.createDemoAccounts();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
            
            // Password strength checker
            const passwordInput = document.getElementById('register-password');
            if (passwordInput) {
                passwordInput.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
            }
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Toggle password visibility
        this.setupPasswordToggles();
    }

    setupPasswordToggles() {
        const toggleButtons = document.querySelectorAll('.toggle-password');
        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const input = e.target.closest('.input-with-icon').querySelector('input');
                const icon = e.target.querySelector('i') || e.target;
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        });
    }

    checkPasswordStrength(password) {
        const strengthFill = document.getElementById('password-strength-fill');
        const strengthText = document.getElementById('password-strength-text');
        
        if (!strengthFill || !strengthText) return;

        let strength = 0;
        let feedback = '';

        // Length check
        if (password.length >= 8) strength += 25;
        
        // Lowercase check
        if (/[a-z]/.test(password)) strength += 25;
        
        // Uppercase check
        if (/[A-Z]/.test(password)) strength += 25;
        
        // Number/Special char check
        if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 25;

        // Update UI
        strengthFill.className = 'strength-fill';
        
        if (strength <= 25) {
            strengthFill.classList.add('weak');
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#e76f51';
        } else if (strength <= 75) {
            strengthFill.classList.add('medium');
            strengthText.textContent = 'Medium';
            strengthText.style.color = '#f4a261';
        } else {
            strengthFill.classList.add('strong');
            strengthText.textContent = 'Strong';
            strengthText.style.color = '#2a9d8f';
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        return password.length >= 6;
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            const input = errorElement.closest('.form-group').querySelector('input');
            if (input) {
                input.classList.add('error');
            }
        }
    }

    clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            const input = errorElement.closest('.form-group').querySelector('input');
            if (input) {
                input.classList.remove('error');
            }
        }
    }

    showLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.add('active');
        }
    }

    hideLoading() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.remove('active');
        }
    }

    showSuccessMessage(message) {
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = message;
        document.body.appendChild(successMsg);

        setTimeout(() => {
            successMsg.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                document.body.removeChild(successMsg);
            }, 300);
        }, 3000);
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me')?.checked;

        // Clear previous errors
        this.clearError('email-error');
        this.clearError('password-error');

        // Validate inputs
        let isValid = true;

        if (!this.validateEmail(email)) {
            this.showError('email-error', 'Please enter a valid email address');
            isValid = false;
        }

        if (!this.validatePassword(password)) {
            this.showError('password-error', 'Password must be at least 6 characters long');
            isValid = false;
        }

        if (!isValid) return;

        this.showLoading();

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = user;
            this.createSession(rememberMe);
            this.hideLoading();
            this.showSuccessMessage('Login successful! Redirecting...');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            this.hideLoading();
            this.showError('password-error', 'Invalid email or password');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const agreeTerms = document.getElementById('agree-terms').checked;

        // Clear previous errors
        this.clearError('first-name-error');
        this.clearError('last-name-error');
        this.clearError('register-email-error');
        this.clearError('register-password-error');
        this.clearError('confirm-password-error');

        // Validate inputs
        let isValid = true;

        if (firstName.length < 2) {
            this.showError('first-name-error', 'First name must be at least 2 characters long');
            isValid = false;
        }

        if (lastName.length < 2) {
            this.showError('last-name-error', 'Last name must be at least 2 characters long');
            isValid = false;
        }

        if (!this.validateEmail(email)) {
            this.showError('register-email-error', 'Please enter a valid email address');
            isValid = false;
        }

        if (!this.validatePassword(password)) {
            this.showError('register-password-error', 'Password must be at least 6 characters long');
            isValid = false;
        }

        if (password !== confirmPassword) {
            this.showError('confirm-password-error', 'Passwords do not match');
            isValid = false;
        }

        if (!agreeTerms) {
            alert('Please agree to the Terms of Service and Privacy Policy');
            isValid = false;
        }

        if (!isValid) return;

        // Check if email already exists
        const users = this.getUsers();
        if (users.find(u => u.email === email)) {
            this.showError('register-email-error', 'Email already registered');
            return;
        }

        this.showLoading();

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create new user
        const newUser = {
            id: this.generateId(),
            firstName,
            lastName,
            email,
            password,
            createdAt: new Date().toISOString(),
            lastLogin: null
        };

        users.push(newUser);
        this.saveUsers(users);

        this.hideLoading();
        this.showSuccessMessage('Account created successfully! Redirecting to login...');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            this.destroySession();
            window.location.href = 'index.html';
        }
    }

    createSession(rememberMe = false) {
        const session = {
            user: this.currentUser,
            expires: Date.now() + this.sessionDuration,
            rememberMe
        };

        if (rememberMe) {
            localStorage.setItem('authSession', JSON.stringify(session));
        } else {
            sessionStorage.setItem('authSession', JSON.stringify(session));
        }

        // Update user's last login
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].lastLogin = new Date().toISOString();
            this.saveUsers(users);
        }

        this.startSessionTimer();
    }

    destroySession() {
        localStorage.removeItem('authSession');
        sessionStorage.removeItem('authSession');
        this.currentUser = null;
        
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }
    }

    checkAuthentication() {
        let session = sessionStorage.getItem('authSession') || localStorage.getItem('authSession');
        
        if (session) {
            session = JSON.parse(session);
            
            if (Date.now() > session.expires) {
                this.destroySession();
                this.redirectToLogin();
                return;
            }

            this.currentUser = session.user;
            
            // If on login/register page, redirect to dashboard
            if (window.location.pathname.includes('index.html') || 
                window.location.pathname.includes('register.html')) {
                window.location.href = 'dashboard.html';
            } else {
                this.startSessionTimer();
                this.updateDashboard();
            }
        } else {
            // If on dashboard without session, redirect to login
            if (window.location.pathname.includes('dashboard.html')) {
                this.redirectToLogin();
            }
        }
    }

    redirectToLogin() {
        if (!window.location.pathname.includes('index.html') && 
            !window.location.pathname.includes('register.html')) {
            window.location.href = 'index.html';
        }
    }

    startSessionTimer() {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }

        this.sessionTimer = setInterval(() => {
            this.updateSessionTimer();
        }, 1000);
    }

    updateSessionTimer() {
        const timerElement = document.getElementById('session-time');
        if (!timerElement) return;

        let session = sessionStorage.getItem('authSession') || localStorage.getItem('authSession');
        if (!session) return;

        session = JSON.parse(session);
        const timeLeft = session.expires - Date.now();

        if (timeLeft <= 0) {
            this.destroySession();
            this.showSuccessMessage('Session expired. Please login again.');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }

        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateDashboard() {
        if (!this.currentUser) return;

        // Update user info
        const userNameElements = document.querySelectorAll('#user-display-name, #welcome-user-name');
        userNameElements.forEach(element => {
            element.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        });

        // Update login info
        const lastLoginElement = document.getElementById('last-login-time');
        const accountCreatedElement = document.getElementById('account-created');
        const currentLoginTimeElement = document.getElementById('current-login-time');

        if (lastLoginElement && this.currentUser.lastLogin) {
            lastLoginElement.textContent = new Date(this.currentUser.lastLogin).toLocaleString();
        }

        if (accountCreatedElement) {
            accountCreatedElement.textContent = new Date(this.currentUser.createdAt).toLocaleDateString();
        }

        if (currentLoginTimeElement) {
            currentLoginTimeElement.textContent = new Date().toLocaleString();
        }
    }

    // Data management methods
    getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    createDemoAccounts() {
        const users = this.getUsers();
        
        // Create demo admin account if it doesn't exist
        if (!users.find(u => u.email === 'admin@example.com')) {
            users.push({
                id: this.generateId(),
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@example.com',
                password: 'admin123',
                createdAt: new Date().toISOString(),
                lastLogin: null
            });
        }

        // Create demo user account if it doesn't exist
        if (!users.find(u => u.email === 'user@example.com')) {
            users.push({
                id: this.generateId(),
                firstName: 'Demo',
                lastName: 'User',
                email: 'user@example.com',
                password: 'user123',
                createdAt: new Date().toISOString(),
                lastLogin: null
            });
        }

        this.saveUsers(users);
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Initialize the authentication system
const authSystem = new AuthSystem();

// Make it globally available for HTML onclick handlers
window.authSystem = authSystem;