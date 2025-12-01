import * as THREE from 'three'
import type { ObstacleType } from '../types'

export class Obstacle {
  mesh: THREE.Mesh
  radius: number
  speed = 20
  type: ObstacleType
  active = true

  constructor(type: ObstacleType) {
    this.type = type
    const { geometry, material, radius } = createObstacleShape(type)
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.castShadow = true
    this.radius = radius
  }

  update(delta: number, gameSpeed: number) {
    this.mesh.position.z += this.speed * gameSpeed * delta
    if (this.mesh.position.z > 40) this.active = false
  }
}

function createObstacleShape(type: ObstacleType) {
  switch (type) {
    case 'rock':
      return { geometry: new THREE.DodecahedronGeometry(1.5, 0), material: new THREE.MeshStandardMaterial({ color: 0x777777 }), radius: 1.5 }
    case 'pillar':
      return { geometry: new THREE.CylinderGeometry(0.5, 0.5, 3, 12), material: new THREE.MeshStandardMaterial({ color: 0x666666 }), radius: 1.2 }
    case 'tree':
      const group = new THREE.ConeGeometry(1.5, 3, 8)
      return { geometry: group, material: new THREE.MeshStandardMaterial({ color: 0x228833 }), radius: 1.5 }
    case 'grass':
      return { geometry: new THREE.BoxGeometry(1, 0.5, 1), material: new THREE.MeshStandardMaterial({ color: 0x66aa33 }), radius: 1 }
    case 'board':
      return { geometry: new THREE.BoxGeometry(2, 15, 0.5), material: new THREE.MeshStandardMaterial({ color: 0x8888aa, transparent: true, opacity: 0.6 }), radius: 1.5 }
    default:
      return { geometry: new THREE.BoxGeometry(1, 1, 1), material: new THREE.MeshStandardMaterial({ color: 0x888888 }), radius: 1 }
  }
}
