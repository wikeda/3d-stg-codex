export class HUD {
  private hpEl: HTMLElement
  private scoreEl: HTMLElement
  private stageEl: HTMLElement
  private messageEl: HTMLElement

  constructor(root: HTMLElement) {
    const hud = document.createElement('div')
    hud.id = 'hud'
    hud.innerHTML = `
      <div class="hud-left">
        <div id="hp-display">HP: 5</div>
      </div>
      <div class="hud-right">
        <div id="stage-display">STAGE 1</div>
        <div id="score-display">SCORE: 0</div>
      </div>
      <div id="message-display"></div>
    `
    root.appendChild(hud)
    this.hpEl = hud.querySelector('#hp-display') as HTMLElement
    this.scoreEl = hud.querySelector('#score-display') as HTMLElement
    this.stageEl = hud.querySelector('#stage-display') as HTMLElement
    this.messageEl = hud.querySelector('#message-display') as HTMLElement
  }

  updateHP(hp: number) {
    this.hpEl.textContent = `HP: ${hp}`
  }

  updateScore(score: number) {
    this.scoreEl.textContent = `SCORE: ${score}`
  }

  updateStage(stage: number) {
    this.stageEl.textContent = `STAGE ${stage}`
  }

  showMessage(text: string) {
    this.messageEl.textContent = text
    this.messageEl.classList.add('visible')
  }

  clearMessage() {
    this.messageEl.textContent = ''
    this.messageEl.classList.remove('visible')
  }
}
