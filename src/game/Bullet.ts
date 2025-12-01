import * as THREE from 'three'

export class Bullet {
  mesh: THREE.Mesh
  radius = 0.6
  speed = 80
  active = true

  constructor(origin: THREE.Vector3) {
    const geo = new THREE.SphereGeometry(this.radius, 8, 8)
    const mat = new THREE.MeshStandardMaterial({ color: 0xffee55, emissive: 0xffcc00 })
    this.mesh = new THREE.Mesh(geo, mat)
    this.mesh.position.copy(origin)
    this.mesh.castShadow = true
  }

  update(delta: number) {
    this.mesh.position.z -= this.speed * delta
    if (this.mesh.position.z < -320) this.active = false
  }
}
