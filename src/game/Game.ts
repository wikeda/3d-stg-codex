import * as THREE from 'three'
import { Background } from '../scene/Background'
import { SceneManager } from '../scene/SceneManager'
import { InputManager } from '../input/InputManager'
import { Player } from './Player'
import { Bullet } from './Bullet'
import { Enemy, type EnemyUpdateResult } from './Enemy'
import { EnemyBullet } from './EnemyBullet'
import { Obstacle } from './Obstacle'
import { Boss } from './Boss'
import { stageConfigs } from './StageData'
import type { GameState, EnemyType, ObstacleType, StageConfig } from '../types'
import { ScoreManager } from '../utils/ScoreManager'
import { CollisionDetector } from '../utils/CollisionDetector'
import { HUD } from '../ui/HUD'

export class Game {
  private sceneManager: SceneManager
  private background: Background
  private input: InputManager
  private hud: HUD

  private player: Player
  private bullets: Bullet[] = []
  private enemies: Enemy[] = []
  private obstacles: Obstacle[] = []
  private enemyBullets: EnemyBullet[] = []
  private boss: Boss | null = null
  private midBoss: Boss | null = null

  private stageIndex = 0
  private state: GameState = 'playing'
  private enemyTimer = 0
  private obstacleTimer = 0
  private elapsed = 0
  private score = new ScoreManager()
  private collision = new CollisionDetector()

  constructor(sceneManager: SceneManager, hud: HUD) {
    this.sceneManager = sceneManager
    this.input = new InputManager(sceneManager.renderer.domElement.parentElement || document.body)
    const stage = this.getStage()
    this.background = new Background(this.sceneManager.scene, stage.ceiling)
    this.background.setSpeed(stage.gameSpeed)
    this.sceneManager.setBackgroundColor(stage.backgroundColor)
    this.background.setGroundColor(stage.groundColor)
    this.player = new Player()
    this.sceneManager.scene.add(this.player.mesh)
    this.hud = hud
    this.hud.updateStage(stage.id)
  }

  private getStage(): StageConfig {
    return stageConfigs[this.stageIndex]
  }

  update(delta: number) {
    if (this.state !== 'playing') return
    const stage = this.getStage()
    this.elapsed += delta
    this.background.update(delta * stage.gameSpeed)
    this.sceneManager.setBackgroundColor(stage.backgroundColor)
    this.background.setGroundColor(stage.groundColor)
    const inputState = this.input.getInputState()
    const pointer = this.input.getPointerTarget()
    this.player.moveToPointer(pointer, delta * stage.gameSpeed)
    this.player.update(delta * stage.gameSpeed, inputState)
    if (inputState.shoot) {
      const bullet = this.player.tryShoot()
      if (bullet) {
        this.bullets.push(bullet)
        this.sceneManager.scene.add(bullet.mesh)
      }
    }

    this.spawnLogic(stage, delta)
    this.updateEntities(delta, stage)
    this.handleCollisions()
    this.cleanup()
    this.updateHud()
    this.checkStageClear(stage)
  }

  private spawnLogic(stage: StageConfig, delta: number) {
    this.enemyTimer -= delta
    this.obstacleTimer -= delta
    if (stage.spawn.hasEnemies && this.enemyTimer <= 0 && !this.boss && !this.midBoss) {
      this.spawnEnemy(stage)
      this.enemyTimer = stage.spawn.enemyInterval
    }
    if (this.obstacleTimer <= 0) {
      this.spawnObstacle(stage)
      this.obstacleTimer = stage.spawn.obstacleInterval
    }

    if (stage.midBoss && !this.midBoss && this.elapsed >= 60 && this.elapsed < stage.duration) {
      this.midBoss = this.spawnBoss(stage.midBoss)
    }
    if (!this.boss && this.elapsed >= stage.duration) {
      this.boss = this.spawnBoss(stage.boss)
    }
  }

  private spawnEnemy(stage: StageConfig) {
    const type = stage.spawn.enemyTypes[Math.floor(Math.random() * stage.spawn.enemyTypes.length)]
    const enemy = createEnemy(type, stage.gameSpeed)
    enemy.mesh.position.set(THREE.MathUtils.randFloat(-10, 10), THREE.MathUtils.randFloat(-3, 3), -100)
    this.enemies.push(enemy)
    this.sceneManager.scene.add(enemy.mesh)
  }

  private spawnObstacle(stage: StageConfig) {
    const types = stage.spawn.obstacleTypes
    const type = types[Math.floor(Math.random() * types.length)]
    const obstacle = new Obstacle(type as ObstacleType)
    obstacle.mesh.position.set(THREE.MathUtils.randFloat(-10, 10), type === 'board' ? 5 : THREE.MathUtils.randFloat(-3, 3), -100)
    this.obstacles.push(obstacle)
    this.sceneManager.scene.add(obstacle.mesh)
  }

  private spawnBoss(type: StageConfig['boss'] | StageConfig['midBoss']) {
    const boss = new Boss(type!)
    this.sceneManager.scene.add(boss.mesh)
    return boss
  }

  private updateEntities(delta: number, stage: StageConfig) {
    for (const bullet of this.bullets) bullet.update(delta)
    for (const enemy of this.enemies) {
      const result = enemy.update(delta * stage.gameSpeed, this.player.mesh.position, stage.spawn.allowEnemyBullets)
      this.handleEnemyUpdate(result)
    }
    for (const ob of this.obstacles) ob.update(delta, stage.gameSpeed)
    for (const b of this.enemyBullets) b.update(delta)

    if (this.midBoss) {
      const bullets = this.midBoss.update(delta, this.player.mesh.position)
      this.enemyBullets.push(...bullets)
      for (const b of bullets) this.sceneManager.scene.add(b.mesh)
    }
    if (this.boss) {
      const bullets = this.boss.update(delta, this.player.mesh.position)
      this.enemyBullets.push(...bullets)
      for (const b of bullets) this.sceneManager.scene.add(b.mesh)
    }
  }

  private handleEnemyUpdate(result: EnemyUpdateResult | null) {
    if (!result?.bullet) return
    this.enemyBullets.push(result.bullet)
    this.sceneManager.scene.add(result.bullet.mesh)
  }

  private handleCollisions() {
    // player bullets vs enemies/boss
    for (const bullet of this.bullets) {
      if (!bullet.active) continue
      for (const enemy of this.enemies) {
        if (!enemy.active) continue
        if (this.collision.checkSphereCollision(bullet.mesh.position, bullet.radius, enemy.mesh.position, enemy.radius)) {
          bullet.active = false
          const destroyed = enemy.takeDamage(1)
          if (destroyed) this.score.addEnemyScore(enemyScore(enemy.type))
        }
      }
      if (this.midBoss && this.midBoss.active && this.collision.checkSphereCollision(bullet.mesh.position, bullet.radius, this.midBoss.mesh.position, this.midBoss.radius)) {
        bullet.active = false
        const destroyed = this.midBoss.takeDamage(2)
        if (destroyed) this.score.addEnemyScore(800)
      }
      if (this.boss && this.boss.active && this.collision.checkSphereCollision(bullet.mesh.position, bullet.radius, this.boss.mesh.position, this.boss.radius)) {
        bullet.active = false
        const destroyed = this.boss.takeDamage(2)
        if (destroyed) this.score.addEnemyScore(1500)
      }
    }

    // player vs enemies/obstacles/enemy bullets
    for (const enemy of this.enemies) {
      if (!enemy.active) continue
      if (this.collision.checkSphereCollision(this.player.mesh.position, this.player.radius, enemy.mesh.position, enemy.radius)) {
        enemy.active = false
        const dead = this.player.takeDamage(1)
        if (dead) this.onGameOver()
      }
    }
    for (const ob of this.obstacles) {
      if (!ob.active) continue
      if (this.collision.checkSphereCollision(this.player.mesh.position, this.player.radius, ob.mesh.position, ob.radius)) {
        ob.active = false
        const dead = this.player.takeDamage(1)
        if (dead) this.onGameOver()
      }
    }
    for (const b of this.enemyBullets) {
      if (!b.active) continue
      if (this.collision.checkSphereCollision(this.player.mesh.position, this.player.radius, b.mesh.position, b.radius)) {
        b.active = false
        const dead = this.player.takeDamage(1)
        if (dead) this.onGameOver()
      }
    }
  }

  private cleanup() {
    this.bullets = this.bullets.filter((b) => {
      if (!b.active) {
        this.sceneManager.scene.remove(b.mesh)
        return false
      }
      return true
    })
    this.enemies = this.enemies.filter((e) => {
      if (!e.active) {
        this.sceneManager.scene.remove(e.mesh)
        return false
      }
      return true
    })
    this.obstacles = this.obstacles.filter((o) => {
      if (!o.active) {
        this.sceneManager.scene.remove(o.mesh)
        return false
      }
      return true
    })
    this.enemyBullets = this.enemyBullets.filter((b) => {
      if (!b.active) {
        this.sceneManager.scene.remove(b.mesh)
        return false
      }
      return true
    })
  }

  private checkStageClear(stage: StageConfig) {
    const bossCleared = !this.boss || !this.boss.active
    const midCleared = !this.midBoss || !this.midBoss.active
    const noPendingBoss = this.elapsed >= stage.duration
    if (noPendingBoss && bossCleared && midCleared && this.enemies.length === 0) {
      this.state = 'stageclear'
      this.score.addStageBonus(stage.id)
      this.hud.showMessage(`STAGE ${stage.id} CLEAR!`)
      setTimeout(() => this.advanceStage(), 1500)
    }
  }

  private advanceStage() {
    this.hud.clearMessage()
    this.stageIndex += 1
    if (this.stageIndex >= stageConfigs.length) {
      this.state = 'gameover'
      this.score.saveHighScore()
      this.hud.showMessage('GAME COMPLETE!')
      return
    }
    const stage = this.getStage()
    this.elapsed = 0
    this.enemyTimer = 0
    this.obstacleTimer = 0
    this.enemies.forEach((e) => this.sceneManager.scene.remove(e.mesh))
    this.obstacles.forEach((o) => this.sceneManager.scene.remove(o.mesh))
    this.enemyBullets.forEach((b) => this.sceneManager.scene.remove(b.mesh))
    this.enemies = []
    this.obstacles = []
    this.enemyBullets = []
    if (this.boss) this.sceneManager.scene.remove(this.boss.mesh)
    if (this.midBoss) this.sceneManager.scene.remove(this.midBoss.mesh)
    this.boss = null
    this.midBoss = null
    this.background.enableCeiling(stage.ceiling, stage.ceilingColor)
    this.background.setSpeed(stage.gameSpeed)
    this.sceneManager.setBackgroundColor(stage.backgroundColor)
    this.background.setGroundColor(stage.groundColor)
    this.hud.updateStage(stage.id)
    this.state = 'playing'
  }

  private onGameOver() {
    this.state = 'gameover'
    this.score.saveHighScore()
    this.hud.showMessage('GAME OVER')
  }

  private updateHud() {
    this.hud.updateHP(this.player.hp)
    this.hud.updateScore(this.score.getScore())
  }
}

function enemyScore(type: EnemyType) {
  switch (type) {
    case 'A':
    case 'B':
    case 'D':
    case 'E':
    case 'F':
      return 100
    case 'C':
      return 200
    default:
      return 100
  }
}

function createEnemy(type: EnemyType, stageSpeed: number) {
  const material = new THREE.MeshStandardMaterial({ color: enemyColor(type as EnemyType), flatShading: true })
  let geo: THREE.BufferGeometry
  let hp = 1
  let speed = 20 * stageSpeed
  let radius = 1
  switch (type) {
    case 'A':
      geo = new THREE.TetrahedronGeometry(1.1)
      radius = 1.1
      break
    case 'B':
      geo = new THREE.OctahedronGeometry(1.3)
      radius = 1.2
      break
    case 'C':
      geo = new THREE.DodecahedronGeometry(1.5)
      hp = 2
      radius = 1.4
      break
    case 'D':
      geo = new THREE.BoxGeometry(1.2, 0.8, 1.2)
      break
    case 'E':
      geo = new THREE.ConeGeometry(1, 2, 6)
      break
    case 'F':
      geo = new THREE.TorusGeometry(1.2, 0.3, 8, 16)
      radius = 1.3
      break
    default:
      geo = new THREE.BoxGeometry(1, 1, 1)
  }
  return new Enemy(type, hp, radius, speed, geo, material)
}

function enemyColor(type: EnemyType) {
  switch (type) {
    case 'A':
      return 0xff3333
    case 'B':
      return 0xff8800
    case 'C':
      return 0xff00aa
    case 'D':
      return 0x66ccff
    case 'E':
      return 0xffcc00
    case 'F':
      return 0x00ffaa
    default:
      return 0xffffff
  }
}
