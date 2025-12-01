import * as THREE from 'three'

export class EnemyBullet {
  mesh: THREE.Mesh
  radius = 1.5
  speed = 10
  active = true
  direction: THREE.Vector3

  constructor(origin: THREE.Vector3, target: THREE.Vector3) {
    const geo = new THREE.SphereGeometry(this.radius, 10, 10)
    const mat = new THREE.MeshStandardMaterial({ color: 0xff3333, emissive: 0xff0000 })
    this.mesh = new THREE.Mesh(geo, mat)
    this.mesh.position.copy(origin)
    this.mesh.castShadow = true
    this.direction = target.clone().sub(origin).normalize()
  }

  update(delta: number) {
    const move = this.direction.clone().multiplyScalar(this.speed * delta)
    this.mesh.position.add(move)
    if (this.mesh.position.length() > 400) this.active = false
  }
}
