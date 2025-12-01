import * as THREE from 'three'

export class CollisionDetector {
  checkSphereCollision(pos1: THREE.Vector3, radius1: number, pos2: THREE.Vector3, radius2: number) {
    const dist = pos1.distanceTo(pos2)
    return dist <= radius1 + radius2
  }
}
