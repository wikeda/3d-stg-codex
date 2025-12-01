import * as THREE from 'three'
import type { BossType } from '../types'
import { EnemyBullet } from './EnemyBullet'

export class Boss {
  mesh: THREE.Mesh
  hp: number
  radius: number
  type: BossType
  active = true
  private fireCooldown = 0

  constructor(type: BossType) {
    this.type = type
    const { geometry, material, hp, radius } = createBossShape(type)
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.castShadow = true
    this.hp = hp
    this.radius = radius
    this.mesh.position.set(0, 0, -80)
  }

  takeDamage(amount: number) {
    this.hp -= amount
    if (this.hp <= 0) {
      this.active = false
      return true
    }
    return false
  }

  update(delta: number, playerPos: THREE.Vector3): EnemyBullet[] {
    if (!this.active) return []
    const bullets: EnemyBullet[] = []
    this.fireCooldown -= delta

    switch (this.type) {
      case 'BOSS1':
        this.mesh.position.x = Math.sin(Date.now() * 0.002) * 8
        break
      case 'BOSS2':
        this.mesh.rotation.z += delta
        this.mesh.position.x = Math.sin(Date.now() * 0.002) * 10
        this.mesh.position.y = Math.cos(Date.now() * 0.003) * 4
        break
      case 'BOSS3':
        this.mesh.position.x = Math.sin(Date.now() * 0.003) * 6
        this.mesh.position.y = Math.sin(Date.now() * 0.004) * 4
        break
      case 'BOSS4H':
        this.mesh.position.x = Math.sin(Date.now() * 0.004) * 5
        break
      case 'BOSS4':
        this.mesh.scale.setScalar(1 + Math.sin(Date.now() * 0.004) * 0.2)
        this.mesh.position.x = Math.sin(Date.now() * 0.003) * 7
        this.mesh.position.y = Math.sin(Date.now() * 0.005) * 3
        break
      case 'BOSS5H':
        this.mesh.rotation.z += delta * 0.5
        break
      case 'BOSS5':
        this.mesh.position.x = Math.sin(Date.now() * 0.003) * 9
        this.mesh.position.y = Math.sin(Date.now() * 0.004) * 5
        this.mesh.rotation.y += delta * 0.6
        break
    }

    if (this.fireCooldown <= 0) {
      this.fireCooldown = this.type === 'BOSS3' ? 0.6 : 1.0
      const directions = getFireDirections(this.type, playerPos, this.mesh.position)
      for (const dir of directions) {
        const bullet = new EnemyBullet(this.mesh.position.clone(), this.mesh.position.clone().add(dir))
        bullet.speed = 12
        bullets.push(bullet)
      }
    }

    if (this.mesh.position.z < -40) {
      this.mesh.position.z += 8 * delta
    }

    return bullets
  }
}

function createBossShape(type: BossType) {
  const materials: Record<BossType, THREE.Material> = {
    BOSS1: new THREE.MeshStandardMaterial({ color: 0x999966, emissive: 0x444400 }),
    BOSS2: new THREE.MeshStandardMaterial({ color: 0x44aa55, emissive: 0x225522 }),
    BOSS3: new THREE.MeshStandardMaterial({ color: 0x6688ff, emissive: 0x3355aa }),
    BOSS4H: new THREE.MeshStandardMaterial({ color: 0xaa4444, emissive: 0x772222 }),
    BOSS4: new THREE.MeshStandardMaterial({ color: 0xff66aa, emissive: 0xaa2255 }),
    BOSS5H: new THREE.MeshStandardMaterial({ color: 0xcccc33, emissive: 0x999900 }),
    BOSS5: new THREE.MeshStandardMaterial({ color: 0x33aaff, emissive: 0x0066ff }),
  }
  const geoLookup: Record<BossType, THREE.BufferGeometry> = {
    BOSS1: new THREE.DodecahedronGeometry(6, 0),
    BOSS2: new THREE.CylinderGeometry(4, 6, 8, 8),
    BOSS3: new THREE.TorusGeometry(6, 2, 12, 32),
    BOSS4H: new THREE.BoxGeometry(8, 4, 4),
    BOSS4: new THREE.IcosahedronGeometry(7, 1),
    BOSS5H: new THREE.BoxGeometry(10, 2, 10),
    BOSS5: new THREE.TorusKnotGeometry(6, 1.5, 64, 12),
  }
  const hpLookup: Record<BossType, number> = {
    BOSS1: 40,
    BOSS2: 60,
    BOSS3: 70,
    BOSS4H: 30,
    BOSS4: 80,
    BOSS5H: 45,
    BOSS5: 120,
  }
  const radiusLookup: Record<BossType, number> = {
    BOSS1: 6,
    BOSS2: 7,
    BOSS3: 8,
    BOSS4H: 5,
    BOSS4: 8,
    BOSS5H: 7,
    BOSS5: 9,
  }
  return {
    geometry: geoLookup[type],
    material: materials[type],
    hp: hpLookup[type],
    radius: radiusLookup[type],
  }
}

function getFireDirections(type: BossType, player: THREE.Vector3, pos: THREE.Vector3) {
  const base = player.clone().sub(pos).normalize()
  const dirs: THREE.Vector3[] = [base]
  const spread = 0.4
  if (type === 'BOSS3' || type === 'BOSS5') {
    dirs.push(base.clone().add(new THREE.Vector3(spread, 0, 0)).normalize())
    dirs.push(base.clone().add(new THREE.Vector3(-spread, 0, 0)).normalize())
    dirs.push(base.clone().add(new THREE.Vector3(0, spread, 0)).normalize())
    dirs.push(base.clone().add(new THREE.Vector3(0, -spread, 0)).normalize())
  } else if (type === 'BOSS4' || type === 'BOSS2') {
    dirs.push(base.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), 0.3).normalize())
    dirs.push(base.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), -0.3).normalize())
  }
  return dirs
}
