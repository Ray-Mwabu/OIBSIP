

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class NumberGuessingGame extends JFrame {
    // Game constants
    private static final int MAX_ATTEMPTS = 7;
    private static final int MAX_ROUNDS = 3;
    
    // Game state
    private int currentRound = 1;
    private int attemptsUsed = 0;
    private int totalScore = 0;
    private int numberToGuess;
    private Random random = new Random();
    private List<GameResult> gameResults = new ArrayList<>();
    
    // UI Components
    private JLabel titleLabel;
    private JLabel roundLabel;
    private JLabel attemptsLabel;
    private JLabel hintLabel;
    private JTextField guessField;
    private JButton guessButton;
    private JButton nextRoundButton;
    private JButton restartButton;
    private JProgressBar progressBar;
    private JTextArea resultsArea;
    
    public NumberGuessingGame() {
        initializeUI();
        startNewRound();
    }
    
    private void initializeUI() {
        setTitle("🎯 Number Guessing Game - Swing Version");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout(10, 10));
        setBackground(new Color(102, 126, 234));
        
        // Create and add all panels
        add(createHeader(), BorderLayout.NORTH);
        add(createGameArea(), BorderLayout.CENTER);
        add(createControlArea(), BorderLayout.SOUTH);
        
        pack();
        setLocationRelativeTo(null); // Center the window
        setResizable(false);
    }
    
    private JPanel createHeader() {
        JPanel header = new JPanel();
        header.setLayout(new BoxLayout(header, BoxLayout.Y_AXIS));
        header.setOpaque(false);
        header.setBorder(new EmptyBorder(10, 0, 20, 0));
        
        titleLabel = new JLabel("🎯 Number Guessing Game");
        titleLabel.setFont(new Font("Arial", Font.BOLD, 28));
        titleLabel.setForeground(Color.WHITE);
        titleLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        
        JLabel subtitleLabel = new JLabel("Guess the number between 1 and 100");
        subtitleLabel.setFont(new Font("Arial", Font.PLAIN, 14));
        subtitleLabel.setForeground(Color.LIGHT_GRAY);
        subtitleLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        
        header.add(titleLabel);
        header.add(Box.createRigidArea(new Dimension(0, 5)));
        header.add(subtitleLabel);
        
        return header;
    }
    
    private JPanel createGameArea() {
        JPanel gamePanel = new JPanel();
        gamePanel.setLayout(new BoxLayout(gamePanel, BoxLayout.Y_AXIS));
        gamePanel.setBackground(Color.WHITE);
        gamePanel.setBorder(BorderFactory.createCompoundBorder(
            new LineBorder(new Color(200, 200, 200), 1),
            new EmptyBorder(20, 20, 20, 20)
        ));
        
        // Round information
        roundLabel = new JLabel("Round: 1/" + MAX_ROUNDS);
        roundLabel.setFont(new Font("Arial", Font.BOLD, 20));
        roundLabel.setForeground(new Color(0, 0, 139));
        roundLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        
        // Progress bar
        progressBar = new JProgressBar(0, MAX_ATTEMPTS);
        progressBar.setValue(0);
        progressBar.setPreferredSize(new Dimension(400, 25));
        progressBar.setMaximumSize(new Dimension(400, 25));
        progressBar.setForeground(new Color(76, 175, 80));
        progressBar.setAlignmentX(Component.CENTER_ALIGNMENT);
        
        // Attempts counter
        attemptsLabel = new JLabel("Attempts: 0/" + MAX_ATTEMPTS);
        attemptsLabel.setFont(new Font("Arial", Font.BOLD, 16));
        attemptsLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        
        // Hint label
        hintLabel = new JLabel("I'm thinking of a number between 1-100");
        hintLabel.setFont(new Font("Arial", Font.PLAIN, 14));
        hintLabel.setForeground(new Color(0, 100, 0));
        hintLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        
        // Input area
        JPanel inputPanel = new JPanel();
        inputPanel.setLayout(new FlowLayout(FlowLayout.CENTER, 15, 0));
        inputPanel.setBackground(Color.WHITE);
        inputPanel.setAlignmentX(Component.CENTER_ALIGNMENT);
        
        guessField = new JTextField();
        guessField.setPreferredSize(new Dimension(200, 40));
        guessField.setFont(new Font("Arial", Font.PLAIN, 14));
        guessField.setHorizontalAlignment(JTextField.CENTER);
        
        guessButton = new JButton("Guess");
        guessButton.setPreferredSize(new Dimension(100, 40));
        guessButton.setFont(new Font("Arial", Font.BOLD, 14));
        guessButton.setBackground(new Color(76, 175, 80));
        guessButton.setForeground(Color.WHITE);
        guessButton.setFocusPainted(false);
        
        // Add action listeners
        guessButton.addActionListener(new GuessButtonListener());
        guessField.addActionListener(new GuessButtonListener());
        
        inputPanel.add(guessField);
        inputPanel.add(guessButton);
        
        // Add components to game panel
        gamePanel.add(roundLabel);
        gamePanel.add(Box.createRigidArea(new Dimension(0, 20)));
        gamePanel.add(progressBar);
        gamePanel.add(Box.createRigidArea(new Dimension(0, 15)));
        gamePanel.add(attemptsLabel);
        gamePanel.add(Box.createRigidArea(new Dimension(0, 15)));
        gamePanel.add(hintLabel);
        gamePanel.add(Box.createRigidArea(new Dimension(0, 20)));
        gamePanel.add(inputPanel);
        
        return gamePanel;
    }
    
    private JPanel createControlArea() {
        JPanel controlPanel = new JPanel();
        controlPanel.setLayout(new BoxLayout(controlPanel, BoxLayout.Y_AXIS));
        controlPanel.setOpaque(false);
        controlPanel.setBorder(new EmptyBorder(20, 0, 0, 0));
        
        // Control buttons
        JPanel buttonPanel = new JPanel();
        buttonPanel.setLayout(new FlowLayout(FlowLayout.CENTER, 15, 0));
        buttonPanel.setOpaque(false);
        
        nextRoundButton = new JButton("Next Round");
        nextRoundButton.setPreferredSize(new Dimension(120, 35));
        nextRoundButton.setFont(new Font("Arial", Font.BOLD, 12));
        nextRoundButton.setBackground(new Color(33, 150, 243));
        nextRoundButton.setForeground(Color.WHITE);
        nextRoundButton.setFocusPainted(false);
        nextRoundButton.addActionListener(e -> startNewRound());
        nextRoundButton.setEnabled(false);
        
        restartButton = new JButton("Restart Game");
        restartButton.setPreferredSize(new Dimension(120, 35));
        restartButton.setFont(new Font("Arial", Font.BOLD, 12));
        restartButton.setBackground(new Color(255, 152, 0));
        restartButton.setForeground(Color.WHITE);
        restartButton.setFocusPainted(false);
        restartButton.addActionListener(e -> restartGame());
        
        buttonPanel.add(nextRoundButton);
        buttonPanel.add(restartButton);
        
        // Results area
        JLabel resultsTitle = new JLabel("Game Results:");
        resultsTitle.setFont(new Font("Arial", Font.BOLD, 16));
        resultsTitle.setForeground(Color.WHITE);
        resultsTitle.setAlignmentX(Component.CENTER_ALIGNMENT);
        
        resultsArea = new JTextArea(8, 50);
        resultsArea.setEditable(false);
        resultsArea.setFont(new Font("Consolas", Font.PLAIN, 12));
        resultsArea.setBackground(new Color(248, 249, 250));
        resultsArea.setBorder(BorderFactory.createCompoundBorder(
            new LineBorder(Color.GRAY, 1),
            new EmptyBorder(10, 10, 10, 10)
        ));
        
        JScrollPane scrollPane = new JScrollPane(resultsArea);
        scrollPane.setPreferredSize(new Dimension(500, 150));
        scrollPane.setAlignmentX(Component.CENTER_ALIGNMENT);
        
        controlPanel.add(buttonPanel);
        controlPanel.add(Box.createRigidArea(new Dimension(0, 15)));
        controlPanel.add(resultsTitle);
        controlPanel.add(Box.createRigidArea(new Dimension(0, 10)));
        controlPanel.add(scrollPane);
        
        return controlPanel;
    }
    
    private void startNewRound() {
        numberToGuess = random.nextInt(100) + 1;
        attemptsUsed = 0;
        
        updateUI();
        guessField.setEnabled(true);
        guessButton.setEnabled(true);
        nextRoundButton.setEnabled(false);
        
        guessField.requestFocus();
    }
    
    private void updateUI() {
        roundLabel.setText("Round: " + currentRound + "/" + MAX_ROUNDS);
        attemptsLabel.setText("Attempts: " + attemptsUsed + "/" + MAX_ATTEMPTS);
        progressBar.setValue(attemptsUsed);
        updateResultsDisplay();
    }
    
    private void processGuess() {
        String input = guessField.getText().trim();
        
        if (input.isEmpty()) {
            showMessage("Error", "Please enter a number!");
            return;
        }
        
        try {
            int guess = Integer.parseInt(input);
            
            if (guess < 1 || guess > 100) {
                showMessage("Error", "Please enter a number between 1 and 100!");
                guessField.setText("");
                return;
            }
            
            attemptsUsed++;
            updateUI();
            
            if (guess == numberToGuess) {
                handleWin();
            } else {
                handleWrongGuess(guess);
            }
            
            guessField.setText("");
            
        } catch (NumberFormatException e) {
            showMessage("Error", "Please enter a valid number!");
            guessField.setText("");
        }
    }
    
    private void handleWin() {
        int roundScore = calculateScore();
        totalScore += roundScore;
        
        GameResult result = new GameResult(currentRound, attemptsUsed, roundScore, true, 
                                         String.valueOf(numberToGuess));
        gameResults.add(result);
        
        hintLabel.setText("🎉 CORRECT! The number was " + numberToGuess);
        hintLabel.setForeground(Color.GREEN);
        
        guessField.setEnabled(false);
        guessButton.setEnabled(false);
        
        if (currentRound < MAX_ROUNDS) {
            nextRoundButton.setEnabled(true);
            showMessage("Congratulations!", 
                "You won Round " + currentRound + "!\n" +
                "Attempts: " + attemptsUsed + "\n" +
                "Round Score: " + roundScore + " points\n" +
                "Total Score: " + totalScore + " points\n\n" +
                "Click 'Next Round' to continue!");
        } else {
            showMessage("Game Complete!", 
                "🎊 YOU WON THE GAME! 🎊\n" +
                "Final Score: " + totalScore + " points\n\n" +
                "Click 'Restart Game' to play again!");
        }
        
        if (currentRound <= MAX_ROUNDS) {
            currentRound++;
        }
    }
    
    private void handleWrongGuess(int guess) {
        String direction = guess < numberToGuess ? "HIGHER" : "LOWER";
        hintLabel.setText("The number is " + direction + " than " + guess);
        hintLabel.setForeground(Color.ORANGE);
        
        // Give hints after certain attempts
        if (attemptsUsed == 3) {
            giveHint();
        }
        
        if (attemptsUsed >= MAX_ATTEMPTS) {
            // Out of attempts - player loses
            GameResult result = new GameResult(currentRound, attemptsUsed, 0, false, 
                                             String.valueOf(numberToGuess));
            gameResults.add(result);
            
            hintLabel.setText("💔 Game Over! The number was " + numberToGuess);
            hintLabel.setForeground(Color.RED);
            
            guessField.setEnabled(false);
            guessButton.setEnabled(false);
            
            if (currentRound < MAX_ROUNDS) {
                nextRoundButton.setEnabled(true);
                showMessage("Round Over", 
                    "You ran out of attempts!\n" +
                    "The number was: " + numberToGuess + "\n\n" +
                    "Click 'Next Round' to continue!");
            } else {
                showMessage("Game Over", 
                    "You've completed all rounds!\n" +
                    "Final Score: " + totalScore + " points\n\n" +
                    "Click 'Restart Game' to play again!");
            }
            
            currentRound++;
        }
    }
    
    private void giveHint() {
        String hint = "";
        
        // Even/Odd hint
        if (numberToGuess % 2 == 0) {
            hint += "Hint: The number is EVEN. ";
        } else {
            hint += "Hint: The number is ODD. ";
        }
        
        // Range hint
        if (numberToGuess <= 25) {
            hint += "It's between 1-25";
        } else if (numberToGuess <= 50) {
            hint += "It's between 26-50";
        } else if (numberToGuess <= 75) {
            hint += "It's between 51-75";
        } else {
            hint += "It's between 76-100";
        }
        
        showMessage("💡 Hint", hint);
    }
    
    private int calculateScore() {
        int basePoints = 100;
        int bonusPoints = (MAX_ATTEMPTS - attemptsUsed) * 20;
        return Math.max(basePoints + bonusPoints, 50);
    }
    
    private void updateResultsDisplay() {
        StringBuilder sb = new StringBuilder();
        sb.append("=== GAME RESULTS ===\n\n");
        
        if (gameResults.isEmpty()) {
            sb.append("No rounds completed yet.\n");
        } else {
            for (GameResult result : gameResults) {
                sb.append(result.toString()).append("\n");
            }
            sb.append("\nTotal Score: ").append(totalScore).append(" points\n");
            
            // Add ranking
            if (totalScore >= 300) {
                sb.append("🏆 Rank: GUESSING MASTER!");
            } else if (totalScore >= 200) {
                sb.append("🥈 Rank: EXPERT GUESSER!");
            } else if (totalScore >= 100) {
                sb.append("🥉 Rank: GOOD PLAYER!");
            } else {
                sb.append("🎯 Rank: BEGINNER - Keep practicing!");
            }
        }
        
        resultsArea.setText(sb.toString());
    }
    
    private void restartGame() {
        currentRound = 1;
        totalScore = 0;
        gameResults.clear();
        startNewRound();
        
        hintLabel.setText("I'm thinking of a number between 1-100");
        hintLabel.setForeground(new Color(0, 100, 0));
    }
    
    private void showMessage(String title, String message) {
        JOptionPane.showMessageDialog(this, message, title, JOptionPane.INFORMATION_MESSAGE);
    }
    
    // Action listener for guess button
    private class GuessButtonListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            processGuess();
        }
    }
    
    // MAIN METHOD - This is what was missing!
    public static void main(String[] args) {
        // Set look and feel to system default
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        // Create and show the game window
        SwingUtilities.invokeLater(() -> {
            NumberGuessingGame game = new NumberGuessingGame();
            game.setVisible(true);
            
            System.out.println("🎮 Number Guessing Game Started!");
            System.out.println("👨‍💻 Developed by: Ray Mwabu Chishala");
            System.out.println("🏢 Oasis Infobyte Internship");
        });
    }
}