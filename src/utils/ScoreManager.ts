const HIGH_SCORE_KEY = '3d-stg-high-score'

export class ScoreManager {
  private score = 0
  private highScore = 0

  constructor() {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(HIGH_SCORE_KEY) : null
    this.highScore = stored ? Number(stored) || 0 : 0
  }

  addEnemyScore(amount: number) {
    this.score += amount
  }

  addStageBonus(stage: number) {
    this.score += stage * 1000
  }

  getScore() {
    return this.score
  }

  getHighScore() {
    return this.highScore
  }

  saveHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(HIGH_SCORE_KEY, String(this.highScore))
      }
    }
  }

  reset() {
    this.score = 0
  }
}
