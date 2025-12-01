import * as THREE from 'three'
import type { EnemyType } from '../types'
import { enemySvg } from '../assets/svg'
import { loadExtrudedGeometry } from '../assets/svgLoader'
import { Enemy } from './Enemy'

export interface EnemyFactoryResources {
  geometry: THREE.BufferGeometry
}

let cachedResources: EnemyFactoryResources | null = null

export async function loadEnemyResources(): Promise<EnemyFactoryResources> {
  if (cachedResources) return cachedResources
  const geometry = await loadExtrudedGeometry(enemySvg, 6)
  cachedResources = { geometry }
  return cachedResources
}

export function createEnemy(type: EnemyType, stageSpeed: number, resources: EnemyFactoryResources) {
  const material = new THREE.MeshStandardMaterial({
    color: enemyColor(type),
    flatShading: true,
    metalness: 0.05,
    roughness: 0.35,
    emissive: new THREE.Color(0x0b0e1f),
    emissiveIntensity: 0.35,
  })
  const outline = new THREE.Mesh(resources.geometry, new THREE.MeshBasicMaterial({ color: 0x0b0e1f, side: THREE.BackSide }))
  let hp = 1
  let speed = 20 * stageSpeed
  let radius = 1.2
  switch (type) {
    case 'C':
      hp = 2
      radius = 1.4
      break
    default:
      break
  }
  const enemy = new Enemy(type, hp, radius, speed, resources.geometry, material)
  enemy.mesh.scale.set(0.1, 0.1, 0.08)
  outline.scale.copy(enemy.mesh.scale).multiplyScalar(1.08)
  enemy.mesh.add(outline)
  return enemy
}

function enemyColor(type: EnemyType) {
  switch (type) {
    case 'A':
      return 0xff8a80
    case 'B':
      return 0xffc266
    case 'C':
      return 0xff66cc
    case 'D':
      return 0x66ccff
    case 'E':
      return 0xffe266
    case 'F':
      return 0x7dffb2
    default:
      return 0xffffff
  }
}
