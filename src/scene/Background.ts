import * as THREE from 'three'

export class Background {
  private scene: THREE.Scene
  private ground: THREE.Mesh
  private ceiling?: THREE.Mesh
  private stars: THREE.Points
  private speed = 0.5
  private offset = 0
  private planeGeo: THREE.PlaneGeometry
  private ceilingColor = 0x335588

  constructor(scene: THREE.Scene, hasCeiling: boolean) {
    this.scene = scene
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x227733, side: THREE.DoubleSide })
    groundMat.map = this.createCheckerTexture()
    groundMat.map.repeat.set(20, 80)
    groundMat.map.wrapS = groundMat.map.wrapT = THREE.RepeatWrapping
    this.planeGeo = new THREE.PlaneGeometry(200, 800, 10, 10)
    this.ground = new THREE.Mesh(this.planeGeo, groundMat)
    this.ground.rotation.x = -Math.PI / 2
    this.ground.position.set(0, -8, -100)
    this.ground.receiveShadow = true
    this.scene.add(this.ground)

    if (hasCeiling) {
      this.createCeiling()
    }

    const starGeo = new THREE.BufferGeometry()
    const starCount = 500
    const positions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = THREE.MathUtils.randFloatSpread(200)
      positions[i * 3 + 1] = THREE.MathUtils.randFloat(10, 50)
      positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(250)
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.6 })
    this.stars = new THREE.Points(starGeo, starMat)
    this.scene.add(this.stars)
  }

  setSpeed(base: number) {
    this.speed = 0.5 * base
  }

  setGroundColor(color: number) {
    ;(this.ground.material as THREE.MeshStandardMaterial).color.setHex(color)
    if (this.ceiling) {
      ;(this.ceiling.material as THREE.MeshStandardMaterial).color.setHex(this.ceilingColor)
    }
  }

  enableCeiling(enable: boolean, color?: number) {
    if (color) this.ceilingColor = color
    if (enable && !this.ceiling) {
      this.createCeiling()
    }
    if (this.ceiling) this.ceiling.visible = enable
  }

  update(delta: number) {
    this.offset += this.speed * delta
    const offset = this.offset
    ;(this.ground.material as THREE.MeshStandardMaterial).map?.offset.set(0, offset)
    if (this.ceiling) {
      ;(this.ceiling.material as THREE.MeshStandardMaterial).map?.offset.set(0, -offset)
    }
  }

  private createCeiling() {
    const ceilingMat = new THREE.MeshStandardMaterial({ color: this.ceilingColor, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    ceilingMat.map = this.createCheckerTexture()
    ceilingMat.map.repeat.set(20, 80)
    ceilingMat.map.wrapS = ceilingMat.map.wrapT = THREE.RepeatWrapping
    this.ceiling = new THREE.Mesh(this.planeGeo, ceilingMat)
    this.ceiling.rotation.x = Math.PI / 2
    this.ceiling.position.set(0, 20, -100)
    this.scene.add(this.ceiling)
  }

  private createCheckerTexture() {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#1d1f2a'
    ctx.fillRect(0, 0, size, size)
    ctx.fillStyle = '#202b40'
    ctx.fillRect(0, 0, size / 2, size / 2)
    ctx.fillRect(size / 2, size / 2, size / 2, size / 2)
    const texture = new THREE.CanvasTexture(canvas)
    texture.anisotropy = 8
    return texture
  }
}
