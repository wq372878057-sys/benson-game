import { Enemy } from './game-context';

export interface GameEngineState {
  enemies: Enemy[];
  playerX: number;
  playerY: number;
  playerHealth: number;
  score: number;
  waveProgress: number;
}

export class GameEngine {
  private enemies: Enemy[] = [];
  private score: number = 0;
  private playerHealth: number = 100;
  private waveProgress: number = 0;

  constructor() {
    this.reset();
  }

  reset() {
    this.enemies = [];
    this.score = 0;
    this.playerHealth = 100;
    this.waveProgress = 0;
  }

  addEnemy(enemy: Enemy) {
    this.enemies.push(enemy);
  }

  removeEnemy(enemyId: string) {
    this.enemies = this.enemies.filter((e) => e.id !== enemyId);
  }

  updateEnemyPosition(enemyId: string, x: number, y: number) {
    const enemy = this.enemies.find((e) => e.id === enemyId);
    if (enemy) {
      enemy.x = x;
      enemy.y = y;
    }
  }

  damageEnemy(enemyId: string, damage: number) {
    const enemy = this.enemies.find((e) => e.id === enemyId);
    if (enemy) {
      enemy.health = Math.max(0, enemy.health - damage);
      if (enemy.health === 0) {
        this.score += 10;
      }
    }
  }

  damagePlayer(damage: number) {
    this.playerHealth = Math.max(0, this.playerHealth - damage);
  }

  getClosestEnemy(playerX: number, playerY: number): Enemy | null {
    if (this.enemies.length === 0) return null;

    let closest: Enemy | null = null;
    let minDist = Infinity;

    for (const enemy of this.enemies) {
      const dist = Math.sqrt(
        Math.pow(enemy.x - playerX, 2) + Math.pow(enemy.y - playerY, 2)
      );
      if (dist < minDist) {
        minDist = dist;
        closest = enemy;
      }
    }

    return closest;
  }

  checkCollision(
    x1: number,
    y1: number,
    size1: number,
    x2: number,
    y2: number,
    size2: number
  ): boolean {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < (size1 + size2) / 2;
  }

  getState(): GameEngineState {
    return {
      enemies: this.enemies,
      playerX: 0,
      playerY: 0,
      playerHealth: this.playerHealth,
      score: this.score,
      waveProgress: this.waveProgress,
    };
  }
}
