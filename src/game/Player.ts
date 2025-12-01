import * as THREE from 'three'
import type { InputState } from '../types'
import { Bullet } from './Bullet'

export class Player {
  mesh: THREE.Mesh
  radius = 1.5
  hp = 5
  maxHp = 5
  private invincibleTimer = 0
  private reloadTimer = 0
  private magazine = 7
  private maxMagazine = 7
  private reloadDuration = 0.7
  private fireCooldown = 0.15
  private fireTimer = 0

  constructor() {
    const geo = new THREE.ConeGeometry(1.5, 3, 6)
    const mat = new THREE.MeshStandardMaterial({ color: 0x55ccff, emissive: 0x225577 })
    this.mesh = new THREE.Mesh(geo, mat)
    this.mesh.rotation.x = Math.PI
    this.mesh.castShadow = true
    this.mesh.position.set(0, 0, 0)
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
