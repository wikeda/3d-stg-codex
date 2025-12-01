import './style.css'
import { SceneManager } from './scene/SceneManager'
import { HUD } from './ui/HUD'
import { Game } from './game/Game'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('app container not found')

const sceneContainer = document.createElement('div')
sceneContainer.id = 'scene-container'
app.appendChild(sceneContainer)

const hud = new HUD(app)
const sceneManager = new SceneManager(sceneContainer)
const game = new Game(sceneManager, hud)

let last = performance.now()
function loop() {
  const now = performance.now()
  const delta = (now - last) / 1000
  last = now
  game.update(delta)
  sceneManager.render()
  requestAnimationFrame(loop)
}

loop()
