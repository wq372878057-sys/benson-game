export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  difficulty: string;
  enemyHealth: number;
  enemySpeed: number;
  enemyDamage: number;
  spawnRate: number;
  backgroundColor: string;
  icon: string;
}

export interface SkillConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  effect: 'bullets' | 'trajectory' | 'speed' | 'damage' | 'range' | 'split' | 'bounce' | 'pierce';
  value: number;
}

export const LEVELS: Record<number, LevelConfig> = {
  1: {
    id: 1,
    name: '森林之战',
    description: '绿色森林中的怪物',
    difficulty: '简单',
    enemyHealth: 20,
    enemySpeed: 1,
    enemyDamage: 5,
    spawnRate: 800,
    backgroundColor: '#1a3a1a',
    icon: '🌲',
  },
  2: {
    id: 2,
    name: '火焰地狱',
    description: '炽热岩浆中的怪物',
    difficulty: '困难',
    enemyHealth: 30,
    enemySpeed: 1.5,
    enemyDamage: 10,
    spawnRate: 600,
    backgroundColor: '#3a1a1a',
    icon: '🔥',
  },
};

export const SKILLS: SkillConfig[] = [
  {
    id: 'bullets-1',
    name: '子弹连射+1',
    description: '增加一条射击轨道',
    icon: '🔫',
    effect: 'bullets',
    value: 1,
  },
  {
    id: 'trajectory-1',
    name: '子弹弹道+1',
    description: '增加一条反弹轨道',
    icon: '↩️',
    effect: 'trajectory',
    value: 1,
  },
  {
    id: 'speed-20',
    name: '子弹速度+20%',
    description: '子弹飞行速度提升20%',
    icon: '⚡',
    effect: 'speed',
    value: 0.2,
  },
  {
    id: 'damage-20',
    name: '子弹攻击+20%',
    description: '子弹伤害提升20%',
    icon: '💥',
    effect: 'damage',
    value: 0.2,
  },
  {
    id: 'range-20',
    name: '子弹射程+20%',
    description: '子弹射程提升20%',
    icon: '🎯',
    effect: 'range',
    value: 0.2,
  },
  {
    id: 'split-1',
    name: '子弹分裂+1',
    description: '子弹击中后分裂成多发',
    icon: '✨',
    effect: 'split',
    value: 1,
  },
  {
    id: 'bounce-1',
    name: '子弹弹射+1',
    description: '增加一条弹射轨道',
    icon: '🌀',
    effect: 'bounce',
    value: 1,
  },
  {
    id: 'pierce-1',
    name: '子弹穿透+1',
    description: '子弹可穿透敌人',
    icon: '🔱',
    effect: 'pierce',
    value: 1,
  },
];

export const GAME_CONFIG = {
  TOTAL_WAVES: 10,
  ENEMIES_PER_WAVE: 10,
  INITIAL_PLAYER_HEALTH: 100,
  INITIAL_DAMAGE: 10,
  INITIAL_FIRE_RATE: 1,
  PLAYER_SIZE: 40,
  ENEMY_SIZE: 30,
  BULLET_SIZE: 8,
  BULLET_SPEED: 8,
  GAME_LOOP_FPS: 60,
};

export function getRandomSkills(count: number = 3): SkillConfig[] {
  const shuffled = [...SKILLS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
