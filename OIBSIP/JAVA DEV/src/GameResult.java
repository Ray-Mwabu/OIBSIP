

public class GameResult {
    private int round;
    private int attempts;
    private int score;
    private boolean won;
    private String number;
    
    public GameResult(int round, int attempts, int score, boolean won, String number) {
        this.round = round;
        this.attempts = attempts;
        this.score = score;
        this.won = won;
        this.number = number;
    }
    
    // Getters
    public int getRound() { return round; }
    public int getAttempts() { return attempts; }
    public int getScore() { return score; }
    public boolean isWon() { return won; }
    public String getNumber() { return number; }
    
    @Override
    public String toString() {
        return String.format("Round %d: %s - %d attempts - %d points (Number: %s)", 
            round, won ? "WON" : "LOST", attempts, score, number);
    }
}