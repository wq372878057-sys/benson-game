// ============================================================
// 星球大战：银河征服者 - 核心数据类型
// ============================================================

export type ForceAlignment = 'light' | 'dark' | 'balanced';
export type MissionStatus = 'locked' | 'available' | 'active' | 'completed';
export type HeartRateZone = 'rest' | 'warmup' | 'aerobic' | 'fatburn' | 'anaerobic' | 'max';
export type CharacterStatus = 'energized' | 'focused' | 'tired' | 'wavering';
export type GearRarity = 'legendary' | 'elite' | 'common';

export interface ForceState {
  lightSidePoints: number;
  darkSidePoints: number;
  forceLevel: number;
  forceLevelName: string;
  forceAlignment: ForceAlignment;
  darkSideWarning: boolean;
  consecutiveDays: number;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  avatar: string;
  description: string;
  level: number;
  hp: number;
  maxHp: number;
  strength: number;
  agility: number;
  endurance: number;
  forceAffinity: number;
  status: CharacterStatus;
  combatRole: string;
  specialAbility: string;
  equippedGearId?: string;
}

export interface Gear {
  id: string;
  name: string;
  icon: string;
  rarity: GearRarity;
  effect: string;
  unlocked: boolean;
  equipped: boolean;
  holder: string;
  obtainMethod: string;
  stats?: {
    strength?: number;
    agility?: number;
    endurance?: number;
  };
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  side: 'light' | 'dark';
  cost: number;
  effect: string;
  unlocked: boolean;
  unlockCondition: string;
}

export interface Mission {
  id: number;
  name: string;
  location: string;
  sector: string;
  narrative: string;
  status: MissionStatus;
  unlockType: 'steps' | 'sleep' | 'heartrate' | 'combined' | 'tutorial';
  unlockCondition: string;
  unlockTarget: number;
  unlockProgress: number;
  reward: {
    forcePoints: number;
    gear?: string;
    unlock?: string;
  };
  bossName?: string;
  bossHp?: number;
  bossMaxHp?: number;
}

export interface TrainingSession {
  active: boolean;
  type: 'lightsaber' | 'endurance' | 'meditation' | 'assault';
  typeName: string;
  duration: number;
  heartRate: number;
  heartRateZone: HeartRateZone;
  calories: number;
  lightYears: number;
}

export interface BattleState {
  active: boolean;
  bossName: string;
  bossHp: number;
  bossMaxHp: number;
  playerHp: number;
  playerMaxHp: number;
  heartRate: number;
  attackMultiplier: number;
  log: string[];
  result: 'victory' | 'defeat' | null;
}

export interface DailyData {
  date: string;
  steps: number;
  lightYears: number;
  forceGained: number;
  caloriesBurned: number;
  activeMinutes: number;
  sleepHours: number;
  sleepDeepHours: number;
  heartRateAvg: number;
  events: string[];
}

export interface ShipUpgrade {
  engine: number;
  shield: number;
  weapons: number;
  hyperdrive: boolean;
}

export interface GalaxyState {
  totalLightYears: number;
  currentLightYears: number;
  stageGoalLightYears: number;
  currentMission: number;
  currentSector: string;
  completedMissions: number[];
  ship: ShipUpgrade;
}

export interface TodayData {
  steps: number;
  lightYears: number;
  forceGained: number;
  caloriesBurned: number;
  activeMinutes: number;
  heartRateAvg: number;
  sleepHours: number;
  sleepDeepHours: number;
}

export interface GameState {
  force: ForceState;
  characters: Character[];
  gear: Gear[];
  skills: Skill[];
  missions: Mission[];
  training: TrainingSession;
  battle: BattleState;
  galaxy: GalaxyState;
  today: TodayData;
  dailyData: DailyData[];
  credits: number;
  darkMode: boolean;
}
