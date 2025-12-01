export type GameState = 'playing' | 'gameover' | 'stageclear'

export type EnemyType = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
export type BossType = 'BOSS1' | 'BOSS2' | 'BOSS3' | 'BOSS4H' | 'BOSS4' | 'BOSS5H' | 'BOSS5'
export type ObstacleType = 'rock' | 'pillar' | 'tree' | 'grass' | 'board'

export interface StageSpawnPlan {
  hasEnemies: boolean
  enemyTypes: EnemyType[]
  obstacleTypes: ObstacleType[]
  enemyInterval: number
  obstacleInterval: number
  allowEnemyBullets: boolean
}

export interface StageConfig {
  id: number
  name: string
  duration: number
  gameSpeed: number
  backgroundColor: number
  groundColor: number
  ceilingColor?: number
  ceiling: boolean
  boss: BossType
  midBoss?: BossType
  spawn: StageSpawnPlan
}

export interface InputState {
  moveX: number
  moveY: number
  shoot: boolean
}
