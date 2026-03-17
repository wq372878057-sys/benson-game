/**
 * 三国演义：乱世英杰录 — 游戏数据模型与初始状态
 * 包含所有类型定义、游戏常量和初始数据
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Warlord {
  id: string;
  name: string;
  title: string;
  emoji: string;
  color: string;
  level: number;
  hp: number;
  maxHp: number;
  martialPower: number;
  intelligence: number;
  command: number;
  politics: number;
  loyalty: number;
  mood: '昂扬' | '平静' | '疲惫' | '动摇';
  strategySpecialty: string;
  description: string;
  equippedRelic: string | null;
}

export interface Campaign {
  id: number;
  name: string;
  era: string;
  location: string;
  enemy: string;
  enemyEmoji: string;
  enemyHp: number;
  enemyMaxHp: number;
  narrative: string;
  unlockCondition: string;
  reward: { power: number; relic?: string };
  status: 'completed' | 'active' | 'unlockable' | 'locked';
}

export interface Relic {
  id: string;
  name: string;
  grade: '神品' | '仙品' | '凡品';
  emoji: string;
  effect: string;
  holder: string;
  obtained: boolean;
  obtainMethod: string;
}

export interface DailyLog {
  date: string;
  steps: number;
  heartRate: number;
  power: number;
  mileage: number;
  event: string;
  campaign?: string;
}

export interface PrestigeLevel {
  name: string;
  min: number;
  max: number;
  privilege: string;
}

export interface HeartRateZone {
  name: string;
  color: string;
  multiplier: number;
}

export interface GameState {
  // Player Identity
  playerName: string;
  faction: '蜀汉' | '曹魏' | '东吴';
  prestigeLevel: number;
  nationalPower: number;

  // Health Data
  todaySteps: number;
  stepGoal: number;
  todayHeartRate: number;
  todayMaxHeartRate: number;
  todaySleepHours: number;
  todayDeepSleepHours: number;
  consecutiveDays: number;

  // Fatigue System
  fatigueValue: number;

  // Campaign Progress
  currentCampaign: number;
  completedCampaigns: number[];
  unifiedProgress: number;
  campaigns: Campaign[];

  // Warlords
  warlords: Warlord[];

  // Relics
  relics: Relic[];

  // Daily Logs
  dailyLogs: DailyLog[];

  // Watch Mode
  watchMode: 'dashboard' | 'military' | 'battle' | 'quick' | 'stats';

  // Military Timer
  militaryRunning: boolean;
  militaryTimer: number;

  // Battle State
  battlePhase: 'idle' | 'fighting' | 'victory' | 'defeat';
  battlePlayerHp: number;
  battleEnemyHp: number;
  battleLog: string[];

  // Watch Stats
  todayDecisions: number;
  todayDiplomacy: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const PRESTIGE_LEVELS: PrestigeLevel[] = [
  { name: '布衣', min: 0, max: 499, privilege: '基础功能开放' },
  { name: '里长', min: 500, max: 1499, privilege: '解锁「兵法技能」系统' },
  { name: '县令', min: 1500, max: 2999, privilege: '解锁「宝物图鉴」全览' },
  { name: '郡守', min: 3000, max: 4999, privilege: '解锁「武将招募」扩展' },
  { name: '刺史', min: 5000, max: 7999, privilege: '解锁「战役」第4-6章' },
  { name: '将军', min: 8000, max: 11999, privilege: '解锁「三国鼎立」模式' },
  { name: '丞相', min: 12000, max: 19999, privilege: '解锁「天下一统」结局' },
  { name: '王侯', min: 20000, max: 29999, privilege: '解锁「历史长廊」全部内容' },
  { name: '皇帝', min: 30000, max: Infinity, privilege: '全部内容永久解锁' },
];

export const HEART_RATE_ZONES: HeartRateZone[] = [
  { name: '静息', color: 'oklch(0.55 0.12 200)', multiplier: 0.8 },
  { name: '热身', color: 'oklch(0.45 0.1 140)', multiplier: 1.0 },
  { name: '有氧', color: 'oklch(0.65 0.12 90)', multiplier: 1.1 },
  { name: '无氧', color: 'oklch(0.8 0.15 90)', multiplier: 1.3 },
  { name: '临危不乱', color: 'oklch(0.6 0.2 20)', multiplier: 1.5 },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getPrestigeLevel(power: number): number {
  return PRESTIGE_LEVELS.findIndex((l, i) => {
    const next = PRESTIGE_LEVELS[i + 1];
    return power >= l.min && (l.max === Infinity || power <= l.max);
  });
}

export function getHeartRateZone(bpm: number): HeartRateZone {
  if (bpm < 60) return HEART_RATE_ZONES[0];
  if (bpm < 100) return HEART_RATE_ZONES[1];
  if (bpm < 130) return HEART_RATE_ZONES[2];
  if (bpm < 150) return HEART_RATE_ZONES[3];
  return HEART_RATE_ZONES[4];
}

export function calcDailyPower(
  steps: number,
  sleepHours: number,
  consecutiveDays: number,
  fatigueValue: number
): number {
  const stepPower = Math.min(Math.floor(steps / 100), 100);
  const sleepBonus = sleepHours >= 7 ? 30 : 0;
  const streakBonus = consecutiveDays >= 7 ? 20 : consecutiveDays >= 3 ? 10 : 0;
  const fatiguePenalty = fatigueValue > 80 ? -20 : fatigueValue > 50 ? -10 : 0;
  return stepPower + sleepBonus + streakBonus + fatiguePenalty;
}

export function stepsToMileage(steps: number): number {
  return Math.floor(steps / 100);
}

// ─── Initial Data ─────────────────────────────────────────────────────────────

const INITIAL_WARLORDS: Warlord[] = [
  {
    id: 'guanyu',
    name: '关羽',
    title: '武圣',
    emoji: '⚔️',
    color: 'oklch(0.6 0.2 20)',
    level: 5,
    hp: 820,
    maxHp: 1000,
    martialPower: 98,
    intelligence: 72,
    command: 85,
    politics: 60,
    loyalty: 95,
    mood: '昂扬',
    strategySpecialty: '勇武冲锋',
    description: '义薄云天，武艺超群。心率 >140bpm 时，攻击力额外 +15%。',
    equippedRelic: 'qinglong',
  },
  {
    id: 'zhugeliang',
    name: '诸葛亮',
    title: '卧龙',
    emoji: '🪁',
    color: 'oklch(0.55 0.12 200)',
    level: 8,
    hp: 450,
    maxHp: 500,
    martialPower: 45,
    intelligence: 100,
    command: 98,
    politics: 95,
    loyalty: 100,
    mood: '平静',
    strategySpecialty: '运筹帷幄',
    description: '智冠天下，鞠躬尽瘁。每日步数 >8000 步时，国力加成 +20%。',
    equippedRelic: null,
  },
  {
    id: 'caocao',
    name: '曹操',
    title: '魏武',
    emoji: '👑',
    color: 'oklch(0.8 0.15 90)',
    level: 7,
    hp: 680,
    maxHp: 800,
    martialPower: 82,
    intelligence: 95,
    command: 96,
    politics: 92,
    loyalty: 88,
    mood: '平静',
    strategySpecialty: '治世能臣',
    description: '雄才大略，挟天子以令诸侯。睡眠质量佳时，内政效率 +25%。',
    equippedRelic: 'zhangjian',
  },
  {
    id: 'diaochan',
    name: '貂蝉',
    title: '倾国',
    emoji: '🌸',
    color: 'oklch(0.7 0.15 350)',
    level: 4,
    hp: 280,
    maxHp: 350,
    martialPower: 35,
    intelligence: 88,
    command: 55,
    politics: 82,
    loyalty: 72,
    mood: '平静',
    strategySpecialty: '美人计',
    description: '倾国倾城，离间之术无双。外交行动成功率 +30%。',
    equippedRelic: null,
  },
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    name: '黄巾之乱',
    era: '184年',
    location: '冀州',
    enemy: '张角',
    enemyEmoji: '🌪️',
    enemyHp: 0,
    enemyMaxHp: 500,
    narrative: '黄巾军起义，天下大乱。刘备、关羽、张飞桃园三结义，共赴国难。需累计行军 500 里，方可平定黄巾之乱。',
    unlockCondition: '累计 500 里程',
    reward: { power: 100 },
    status: 'completed',
  },
  {
    id: 2,
    name: '虎牢关之战',
    era: '190年',
    location: '虎牢关',
    enemy: '吕布',
    enemyEmoji: '🔱',
    enemyHp: 420,
    enemyMaxHp: 650,
    narrative: '十八路诸侯讨伐董卓，吕布独守虎牢关。三英战吕布，天下第一武将横空出世。',
    unlockCondition: '国力 ≥ 500',
    reward: { power: 150, relic: 'fangtianjihalberd' },
    status: 'active',
  },
  {
    id: 3,
    name: '官渡之战',
    era: '200年',
    location: '官渡',
    enemy: '袁绍',
    enemyEmoji: '🏹',
    enemyHp: 800,
    enemyMaxHp: 800,
    narrative: '曹操以少胜多，奇袭乌巢粮草，大破袁绍十万大军，奠定北方霸主地位。',
    unlockCondition: '完成第2战役 + 国力 ≥ 1500',
    reward: { power: 200 },
    status: 'unlockable',
  },
  {
    id: 4,
    name: '赤壁之战',
    era: '208年',
    location: '赤壁',
    enemy: '曹操水军',
    enemyEmoji: '🔥',
    enemyHp: 1200,
    enemyMaxHp: 1200,
    narrative: '孙刘联军以火攻大破曹操八十万水军，三国鼎立格局初现。借东风，火烧赤壁。',
    unlockCondition: '完成第3战役 + 连续7天',
    reward: { power: 300 },
    status: 'locked',
  },
  {
    id: 5,
    name: '夷陵之战',
    era: '221年',
    location: '夷陵',
    enemy: '陆逊',
    enemyEmoji: '🌊',
    enemyHp: 1500,
    enemyMaxHp: 1500,
    narrative: '刘备为报关羽之仇，倾国伐吴，被陆逊火烧连营七百里，蜀汉元气大伤。',
    unlockCondition: '完成第4战役 + 国力 ≥ 5000',
    reward: { power: 400 },
    status: 'locked',
  },
  {
    id: 6,
    name: '北伐中原',
    era: '228年',
    location: '祁山',
    enemy: '司马懿',
    enemyEmoji: '🦅',
    enemyHp: 2000,
    enemyMaxHp: 2000,
    narrative: '诸葛亮六出祁山，鞠躬尽瘁，死而后已。与司马懿的智慧博弈，成就千古传奇。',
    unlockCondition: '完成第5战役 + 国力 ≥ 8000',
    reward: { power: 500 },
    status: 'locked',
  },
  {
    id: 7,
    name: '五丈原',
    era: '234年',
    location: '五丈原',
    enemy: '天命',
    enemyEmoji: '🌟',
    enemyHp: 3000,
    enemyMaxHp: 3000,
    narrative: '诸葛亮病逝五丈原，秋风五丈原，一代丞相就此陨落。星落秋风五丈原。',
    unlockCondition: '完成第6战役 + 国力 ≥ 12000',
    reward: { power: 800 },
    status: 'locked',
  },
  {
    id: 8,
    name: '三国归晋',
    era: '280年',
    location: '建业',
    enemy: '历史',
    enemyEmoji: '⏳',
    enemyHp: 5000,
    enemyMaxHp: 5000,
    narrative: '天下大势，分久必合。司马炎灭吴，三国归晋，乱世终结。你的选择，改变了历史。',
    unlockCondition: '完成第7战役 + 国力 ≥ 20000',
    reward: { power: 2000 },
    status: 'locked',
  },
];

const INITIAL_RELICS: Relic[] = [
  {
    id: 'qinglong',
    name: '青龙偃月刀',
    grade: '神品',
    emoji: '🌙',
    effect: '武力 +15，心率 >140bpm 时攻击力额外 +20%',
    holder: '关羽',
    obtained: true,
    obtainMethod: '完成「虎牢关之战」',
  },
  {
    id: 'zhangjian',
    name: '倚天剑',
    grade: '神品',
    emoji: '⚡',
    effect: '统帅 +12，每日内政效率 +15%',
    holder: '曹操',
    obtained: true,
    obtainMethod: '完成「官渡之战」',
  },
  {
    id: 'fangtianjihalberd',
    name: '方天画戟',
    grade: '神品',
    emoji: '🔱',
    effect: '武力 +20，单次攻击暴击率 +25%',
    holder: '未装备',
    obtained: false,
    obtainMethod: '完成「虎牢关之战」并击败吕布',
  },
  {
    id: 'kongming_fan',
    name: '羽扇纶巾',
    grade: '仙品',
    emoji: '🪁',
    effect: '智力 +10，兵法技能消耗国力 -20%',
    holder: '诸葛亮',
    obtained: false,
    obtainMethod: '国力达到 3000',
  },
  {
    id: 'jinding',
    name: '金鼎',
    grade: '仙品',
    emoji: '🏺',
    effect: '政治 +8，每日粮草产量 +200',
    holder: '未装备',
    obtained: false,
    obtainMethod: '连续签到 30 天',
  },
  {
    id: 'baguazhen',
    name: '八卦阵图',
    grade: '仙品',
    emoji: '☯️',
    effect: '统帅 +10，防御力 +15%',
    holder: '未装备',
    obtained: false,
    obtainMethod: '完成「北伐中原」',
  },
  {
    id: 'red_hare',
    name: '赤兔马',
    grade: '凡品',
    emoji: '🐎',
    effect: '行军速度 +20%，每日步数上限 +2000',
    holder: '关羽',
    obtained: true,
    obtainMethod: '初始装备',
  },
  {
    id: 'jade_seal',
    name: '传国玉玺',
    grade: '凡品',
    emoji: '🔮',
    effect: '声望加成 +10%，外交成功率 +20%',
    holder: '未装备',
    obtained: false,
    obtainMethod: '完成「虎牢关之战」',
  },
  {
    id: 'iron_armor',
    name: '铁甲战袍',
    grade: '凡品',
    emoji: '🛡️',
    effect: '防御力 +12，疲劳恢复速度 +15%',
    holder: '未装备',
    obtained: false,
    obtainMethod: '国力达到 1000',
  },
  {
    id: 'war_drum',
    name: '战鼓',
    grade: '凡品',
    emoji: '🥁',
    effect: '士气 +10，战役进攻效率 +10%',
    holder: '未装备',
    obtained: false,
    obtainMethod: '完成「黄巾之乱」',
  },
];

const INITIAL_LOGS: DailyLog[] = [
  { date: '2026-03-17', steps: 7842, heartRate: 72, power: 128, mileage: 78, event: '今日行军顺利，诸葛亮献策「空城计」，成功迷惑敌军侦察', campaign: '虎牢关之战' },
  { date: '2026-03-16', steps: 9234, heartRate: 85, power: 142, mileage: 92, event: '关羽心率激增至 158bpm，临危不乱，指挥倍率 ×1.5', campaign: '虎牢关之战' },
  { date: '2026-03-15', steps: 6521, heartRate: 68, power: 95, mileage: 65, event: '今日步数未达标，粮草消耗增加，需加强行军训练' },
  { date: '2026-03-14', steps: 11203, heartRate: 92, power: 178, mileage: 112, event: '大破黄巾军，张角授首，冀州平定！获得「赤兔马」', campaign: '黄巾之乱' },
  { date: '2026-03-13', steps: 8876, heartRate: 78, power: 138, mileage: 88, event: '深度睡眠 2.3 小时，触发「休养生息」奖励 +30 国力' },
  { date: '2026-03-12', steps: 5432, heartRate: 65, power: 74, mileage: 54, event: '疲劳积累至 72，武将士气下降，需犒赏三军' },
  { date: '2026-03-11', steps: 10087, heartRate: 88, power: 160, mileage: 100, event: '连续第 7 天行军，触发「百战百胜」连击奖励 +20 国力' },
];

// ─── Initial State ─────────────────────────────────────────────────────────────

export const initialGameState: GameState = {
  playerName: '主公',
  faction: '蜀汉',
  prestigeLevel: 2,
  nationalPower: 1842,

  todaySteps: 7842,
  stepGoal: 10000,
  todayHeartRate: 72,
  todayMaxHeartRate: 128,
  todaySleepHours: 7.2,
  todayDeepSleepHours: 1.8,
  consecutiveDays: 7,

  fatigueValue: 35,

  currentCampaign: 2,
  completedCampaigns: [1],
  unifiedProgress: 12,
  campaigns: INITIAL_CAMPAIGNS,

  warlords: INITIAL_WARLORDS,
  relics: INITIAL_RELICS,
  dailyLogs: INITIAL_LOGS,

  watchMode: 'dashboard',
  militaryRunning: false,
  militaryTimer: 0,

  battlePhase: 'idle',
  battlePlayerHp: 820,
  battleEnemyHp: 420,
  battleLog: [],

  todayDecisions: 6,
  todayDiplomacy: 4,
};
