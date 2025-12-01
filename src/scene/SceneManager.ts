import * as THREE from 'three'

export class SceneManager {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x111122)

    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 500)
    this.camera.position.set(0, 0, 20)
    this.camera.lookAt(0, 0, 0)

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(this.renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.35)
    const dir = new THREE.DirectionalLight(0xffffff, 1.0)
    dir.position.set(5, 10, 7.5)
    dir.castShadow = true
    dir.shadow.mapSize.width = 1024
    dir.shadow.mapSize.height = 1024
    this.scene.add(ambient)
    this.scene.add(dir)

    window.addEventListener('resize', () => this.onResize(container))
  }

  setBackgroundColor(color: number) {
    this.scene.background = new THREE.Color(color)
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  onResize(container: HTMLElement) {
    this.camera.aspect = container.clientWidth / container.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(container.clientWidth, container.clientHeight)
  }
}
