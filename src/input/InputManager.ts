import type { InputState } from '../types'

export class InputManager {
  private state: InputState = { moveX: 0, moveY: 0, shoot: false }
  private keyDown = new Set<string>()
  private mouseDown = false
  private pointerTarget: { x: number; y: number } | null = null
  private container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('mouseup', this.onMouseUp)
    window.addEventListener('pointermove', this.onPointerMove)
  }

  dispose() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
    window.removeEventListener('mousedown', this.onMouseDown)
    window.removeEventListener('mouseup', this.onMouseUp)
    window.removeEventListener('pointermove', this.onPointerMove)
  }

  private onKeyDown = (e: KeyboardEvent) => {
    this.keyDown.add(e.key.toLowerCase())
    if (e.key === ' ') this.state.shoot = true
  }

  private onKeyUp = (e: KeyboardEvent) => {
    this.keyDown.delete(e.key.toLowerCase())
    if (e.key === ' ') this.state.shoot = false
  }

  private onMouseDown = () => {
    this.mouseDown = true
    this.state.shoot = true
  }

  private onMouseUp = () => {
    this.mouseDown = false
    this.state.shoot = false
  }

  private onPointerMove = (e: PointerEvent) => {
    const rect = this.container.getBoundingClientRect()
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
    this.pointerTarget = { x: nx, y: -ny }
  }

  getInputState(): InputState {
    const moveX = (this.keyDown.has('arrowright') || this.keyDown.has('d') ? 1 : 0) - (this.keyDown.has('arrowleft') || this.keyDown.has('a') ? 1 : 0)
    const moveY = (this.keyDown.has('arrowup') || this.keyDown.has('w') ? 1 : 0) - (this.keyDown.has('arrowdown') || this.keyDown.has('s') ? 1 : 0)
    return {
      moveX,
      moveY,
      shoot: this.state.shoot || this.mouseDown,
    }
  }

  getPointerTarget() {
    return this.pointerTarget
  }
}
