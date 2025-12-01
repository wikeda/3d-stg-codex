import * as THREE from 'three'
import type { InputState } from '../types'
import { Bullet } from './Bullet'
import { loadSvgTexture } from '../assets/svgLoader'
import { playerSvg } from '../assets/svg'

export class Player {
  mesh: THREE.Mesh
  radius = 1.2
  hp = 5
  maxHp = 5
  private invincibleTimer = 0
  private reloadTimer = 0
  private magazine = 7
  private maxMagazine = 7
  private reloadDuration = 0.7
  private fireCooldown = 0.15
  private fireTimer = 0
  private material: THREE.MeshBasicMaterial
  private outline: THREE.Mesh

  constructor() {
    const geo = new THREE.PlaneGeometry(3, 3.6)
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      side: THREE.DoubleSide,
    })
    this.mesh = new THREE.Mesh(geo, this.material)
    this.outline = new THREE.Mesh(
      geo.clone(),
      new THREE.MeshBasicMaterial({ color: 0x0b0e1f, side: THREE.BackSide, transparent: true, opacity: 0.9 })
    )
    this.outline.scale.set(1.12, 1.12, 1)
    this.outline.renderOrder = -1
    this.mesh.add(this.outline)
    this.mesh.position.set(0, 0, 0)
  }

  setTexture(texture: THREE.Texture) {
    this.material.map = texture
    this.material.needsUpdate = true
    this.outline.visible = true
  }

  faceCamera(camera: THREE.Camera) {
    this.mesh.quaternion.copy(camera.quaternion)
  }

  moveToPointer(normalized: { x: number; y: number } | null, delta: number) {
    if (!normalized) return
    const targetX = normalized.x * 12
    const targetY = normalized.y * 7
    const lerpFactor = Math.min(1, delta * 8)
    this.mesh.position.x = THREE.MathUtils.lerp(this.mesh.position.x, targetX, lerpFactor)
    this.mesh.position.y = THREE.MathUtils.lerp(this.mesh.position.y, targetY, lerpFactor)
  }

  update(delta: number, input: InputState) {
    const speed = 20
    this.mesh.position.x = THREE.MathUtils.clamp(this.mesh.position.x + input.moveX * speed * delta, -12, 12)
    this.mesh.position.y = THREE.MathUtils.clamp(this.mesh.position.y + input.moveY * speed * delta, -7, 7)

    if (this.invincibleTimer > 0) this.invincibleTimer -= delta
    if (this.reloadTimer > 0) this.reloadTimer -= delta
    if (this.fireTimer > 0) this.fireTimer -= delta

    if (this.magazine <= 0 && this.reloadTimer <= 0) {
      this.magazine = this.maxMagazine
      this.reloadTimer = this.reloadDuration
    }

  }

  tryShoot(): Bullet | null {
    if (this.fireTimer > 0 || this.magazine <= 0) return null
    this.magazine -= 1
    this.fireTimer = this.fireCooldown
    const origin = this.mesh.position.clone()
    const bullet = new Bullet(origin)
    bullet.mesh.position.z -= 2
    return bullet
  }

  takeDamage(amount: number) {
    if (this.invincibleTimer > 0) return false
    this.hp = Math.max(0, this.hp - amount)
    this.invincibleTimer = 1.0
    return this.hp <= 0
  }

  heal(amount: number) {
    this.hp = Math.min(this.maxHp, this.hp + amount)
  }
}

export async function loadPlayerTexture() {
  const tex = await loadSvgTexture(playerSvg)
  tex.anisotropy = 8
  tex.magFilter = THREE.LinearFilter
  tex.minFilter = THREE.LinearMipMapLinearFilter
  return tex
}
