import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'

export async function loadSvgTexture(svgText: string) {
  const blob = new Blob([svgText], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const loader = new THREE.TextureLoader()
  const texture = await loader.loadAsync(url)
  texture.colorSpace = THREE.SRGBColorSpace
  URL.revokeObjectURL(url)
  return texture
}

export async function loadExtrudedGeometry(svgText: string, depth = 6) {
  const loader = new SVGLoader()
  const svg = loader.parse(svgText)
  const shapes: THREE.Shape[] = []
  svg.paths.forEach((p) => {
    p.toShapes(true).forEach((s) => shapes.push(s))
  })
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: false,
  })
  geometry.center()
  return geometry
}
