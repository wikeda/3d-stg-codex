import * as THREE from 'three'
import type { EnemyType } from '../types'
import { EnemyBullet } from './EnemyBullet'

export interface EnemyUpdateResult {
  bullet?: EnemyBullet
}

export class Enemy {
  mesh: THREE.Mesh
  radius: number
  hp: number
  speed: number
  type: EnemyType
  active = true
  private fired = false
  private wobble = Math.random() * Math.PI * 2

  constructor(type: EnemyType, hp: number, radius: number, speed: number, geometry: THREE.BufferGeometry, material: THREE.Material) {
    this.type = type
    this.hp = hp
    this.radius = radius
    this.speed = speed
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.castShadow = true
  }

  takeDamage(amount: number) {
    this.hp -= amount
    if (this.hp <= 0) {
      this.active = false
      return true
    }
    return false
  }

  update(delta: number, playerPos: THREE.Vector3, canShoot: boolean): EnemyUpdateResult | null {
    if (!this.active) return null
    switch (this.type) {
      case 'A':
        this.mesh.position.z += this.speed * delta
        break;
      case 'B':
        this.mesh.position.z += this.speed * delta
        this.mesh.position.x += Math.sin(Date.now() * 0.003 + this.wobble) * delta * 10
        break;
      case 'C':
        this.mesh.position.z += this.speed * delta
        this.mesh.position.x += Math.sin(Date.now() * 0.005 + this.wobble) * 8 * delta
        this.mesh.position.x += (playerPos.x - this.mesh.position.x) * 0.2 * delta
        break;
      case 'D':
        this.mesh.position.z += this.speed * delta
        this.mesh.position.y += Math.sin(Date.now() * 0.004 + this.wobble) * 6 * delta
        break;
      case 'E':
        this.mesh.position.z += this.speed * delta
        this.mesh.position.x += Math.sin(this.wobble) * -12 * delta
        this.mesh.position.y -= 8 * delta
        break;
      case 'F':
        this.mesh.position.z += this.speed * delta
        this.mesh.position.x += Math.cos(Date.now() * 0.005 + this.wobble) * 6 * delta
        this.mesh.position.y += Math.sin(Date.now() * 0.005 + this.wobble) * 6 * delta
        break;
    }

    if (this.mesh.position.z > 40 || Math.abs(this.mesh.position.x) > 40) {
      this.active = false
    }

    if (canShoot && !this.fired && (this.type === 'B' || this.type === 'C') && this.mesh.position.z >= -30) {
      this.fired = true
      const bullet = new EnemyBullet(this.mesh.position.clone(), playerPos)
      return { bullet }
    }

    return null
  }
}
