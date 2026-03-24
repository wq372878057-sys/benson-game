/**
 * 水浒传：梁山风云录 - 游戏数据定义
 * Design: 水墨江湖·沉浸叙事
 */

// ============ 类型定义 ============

export type LoyaltyLevel = '初入江湖' | '小有名气' | '义薄云天' | '梁山柱石' | '天罡地煞' | '替天行道';
export type WeaponGrade = '神兵' | '宝物' | '凡品';
export type BattleStatus = 'completed' | 'active' | 'unlockable' | 'locked';
export type HeroMorale = '高昂' | '平静' | '低落' | '动摇';

export interface DailyHealth {
  date: string;
  steps: number;
  stepGoal: number;
  heartRateAvg: number;
  heartRateMax: number;
  sleepHours: number;
  sleepDeepHours: number;
  caloriesBurned: number;
  activeMinutes: number;
}

export interface Hero {
  id: string;
  name: string;
  title: string;
  emoji: string;
  color: string;
  description: string;
  level: number;
  hp: number;
  maxHp: number;
  strength: number;
  agility: number;
  physique: number;
  strategy: number;
  morale: HeroMorale;
  sportSpecialty: string;
  sportType: string;
  unlocked: boolean;
  equippedWeapon: string | null;
}

export interface Weapon {
  id: string;
  name: string;
  emoji: string;
  grade: WeaponGrade;
  owner: string;
  effect: string;
  description: string;
  obtained: boolean;
  obtainCondition: string;
}

export interface Battle {
  id: number;
  name: string;
  chapter: string;
  location: string;
  narrative: string;
  enemyEmoji: string;
  enemyName: string;
  status: BattleStatus;
  unlockType: 'steps' | 'sleep' | 'heartRate' | 'loyalty';
  unlockCondition: string;
  unlockGoal: number;
  unlockProgress: number;
  loyaltyReward: number;
  weaponReward: boolean;
  unlockContent: string | null;
}

export interface Skill {
  id: string;
  name: string;
  emoji: string;
  branch: '拳脚' | '刀枪' | '弓箭' | '谋略';
  effect: string;
  level: number;
  maxLevel: number;
  unlocked: boolean;
  unlockCondition: string;
}

export interface JournalEntry {
  date: string;
  event: string;
  loyaltyGained: number;
  milesGained: number;
  battleCompleted: string | null;
  mood: string;
}

export interface WatchState {
  currentScreen: 'dial' | 'workout' | 'battle' | 'quick' | 'stats';
  currentHeartRate: number;
  workoutActive: boolean;
  workoutTime: number;
  workoutCalories: number;
  workoutMiles: number;
  battleEnemyHp: number;
  battleHeroHp: number;
  battleEnemyName: string;
  battleEnemyEmoji: string;
  battleLog: string[];
}

export interface GameState {
  // 玩家状态
  playerName: string;
  loyaltyValue: number;
  loyaltyLevel: LoyaltyLevel;
  evilValue: number;
  totalMiles: number;
  consecutiveDays: number;
  currentBattle: number;
  completedBattles: number[];

  // 健康数据
  dailyHealth: DailyHealth;
  weeklySteps: number[];
  loyaltyHistory: number[];

  // 游戏内容
  heroes: Hero[];
  weapons: Weapon[];
  battles: Battle[];
  skills: Skill[];
  journalEntries: JournalEntry[];

  // Watch 状态
  watchState: WatchState;
}

// ============ 忠义境界配置 ============

export const LOYALTY_LEVELS: { level: LoyaltyLevel; min: number; max: number; description: string }[] = [
  { level: '初入江湖', min: 0, max: 999, description: '刚踏上习武之路，尚需磨砺' },
  { level: '小有名气', min: 1000, max: 4999, description: '已在江湖崭露头角' },
  { level: '义薄云天', min: 5000, max: 14999, description: '忠义之名传遍四方' },
  { level: '梁山柱石', min: 15000, max: 29999, description: '梁山不可或缺之栋梁' },
  { level: '天罡地煞', min: 30000, max: 59999, description: '天罡地煞，威震四海' },
  { level: '替天行道', min: 60000, max: Infinity, description: '替天行道，功德圆满' },
];

export function getLoyaltyLevel(value: number): LoyaltyLevel {
  for (const l of [...LOYALTY_LEVELS].reverse()) {
    if (value >= l.min) return l.level;
  }
  return '初入江湖';
}

// ============ 心率区间 ============

export function getHeartRateZone(hr: number): { zone: string; color: string; multiplier: number } {
  if (hr < 60) return { zone: '静息', color: '#3498DB', multiplier: 0.8 };
  if (hr < 100) return { zone: '热身', color: '#2ECC71', multiplier: 1.0 };
  if (hr < 130) return { zone: '有氧', color: '#F39C12', multiplier: 1.2 };
  if (hr < 160) return { zone: '燃脂', color: '#E67E22', multiplier: 1.5 };
  if (hr < 180) return { zone: '极限', color: '#E74C3C', multiplier: 2.0 };
  return { zone: '超限', color: '#8E44AD', multiplier: 2.5 };
}

export function getAttackMultiplier(hr: number): number {
  return getHeartRateZone(hr).multiplier;
}

// ============ 睡眠评分 ============

export function calculateSleepScore(hours: number, deepHours: number): number {
  let score = 0;
  if (hours >= 7 && hours <= 9) score += 50;
  else if (hours >= 6) score += 30;
  else score += 10;
  
  if (deepHours >= 2) score += 50;
  else if (deepHours >= 1.5) score += 35;
  else if (deepHours >= 1) score += 20;
  else score += 5;
  
  return Math.min(score, 100);
}

// ============ 初始游戏数据 ============

const TODAY = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });

export const INITIAL_HEROES: Hero[] = [
  {
    id: 'songjiang',
    name: '宋江',
    title: '及时雨',
    emoji: '👑',
    color: '#F39C12',
    description: '梁山泊首领，人称及时雨，广施恩德，忠义双全。运动特长：长跑耐力，每日步数目标完成可激活"及时雨"加成。',
    level: 10,
    hp: 1200,
    maxHp: 1200,
    strength: 65,
    agility: 70,
    physique: 80,
    strategy: 95,
    morale: '高昂',
    sportSpecialty: '长跑耐力',
    sportType: '有氧运动',
    unlocked: true,
    equippedWeapon: 'yanqing-sword',
  },
  {
    id: 'lujunyi',
    name: '卢俊义',
    title: '玉麒麟',
    emoji: '🦁',
    color: '#2980B9',
    description: '梁山第二把交椅，武艺超群，棍棒天下无双。运动特长：力量训练，高强度运动可提升攻击力。',
    level: 9,
    hp: 1500,
    maxHp: 1500,
    strength: 98,
    agility: 85,
    physique: 95,
    strategy: 75,
    morale: '平静',
    sportSpecialty: '力量训练',
    sportType: '无氧运动',
    unlocked: true,
    equippedWeapon: 'lujunyi-staff',
  },
  {
    id: 'wuyong',
    name: '吴用',
    title: '智多星',
    emoji: '🧠',
    color: '#8E44AD',
    description: '梁山军师，足智多谋，运筹帷幄。运动特长：瑜伽冥想，优质睡眠可激活谋略加成。',
    level: 8,
    hp: 800,
    maxHp: 800,
    strength: 45,
    agility: 60,
    physique: 55,
    strategy: 99,
    morale: '平静',
    sportSpecialty: '瑜伽冥想',
    sportType: '柔韧训练',
    unlocked: true,
    equippedWeapon: null,
  },
  {
    id: 'likui',
    name: '李逵',
    title: '黑旋风',
    emoji: '🪓',
    color: '#C0392B',
    description: '梁山猛将，双斧无敌，性情直爽。运动特长：高强度间歇，心率超过160bpm可激活狂暴状态。',
    level: 8,
    hp: 1800,
    maxHp: 1800,
    strength: 99,
    agility: 55,
    physique: 99,
    strategy: 20,
    morale: '高昂',
    sportSpecialty: '高强度间歇',
    sportType: 'HIIT训练',
    unlocked: true,
    equippedWeapon: 'likui-axe',
  },
];

export const INITIAL_WEAPONS: Weapon[] = [
  {
    id: 'yanqing-sword',
    name: '雁翎刀',
    emoji: '🗡️',
    grade: '神兵',
    owner: '宋江',
    effect: '战斗攻击力 +15%，步数目标完成时额外 +20%',
    description: '宋江随身佩刀，锋利无比，传说曾斩杀无数贪官污吏。',
    obtained: true,
    obtainCondition: '初始获得',
  },
  {
    id: 'lujunyi-staff',
    name: '浑铁棍',
    emoji: '🪄',
    grade: '神兵',
    owner: '卢俊义',
    effect: '力量训练后攻击力翻倍，连击概率 +30%',
    description: '卢俊义的招牌武器，重达百斤，常人难以举起。',
    obtained: true,
    obtainCondition: '初始获得',
  },
  {
    id: 'likui-axe',
    name: '板斧双刃',
    emoji: '🪓',
    grade: '神兵',
    owner: '李逵',
    effect: '心率超过160bpm时，攻击力 ×3，狂暴状态持续30秒',
    description: '李逵的标志性双斧，沾血必杀，江湖人称"黑旋风"。',
    obtained: true,
    obtainCondition: '初始获得',
  },
  {
    id: 'wusong-knives',
    name: '戒刀',
    emoji: '⚔️',
    grade: '宝物',
    owner: '武松',
    effect: '单次攻击必定暴击，冷却时间60秒',
    description: '武松出家后随身携带的戒刀，传说可斩断一切邪恶。',
    obtained: false,
    obtainCondition: '完成"景阳冈打虎"战役解锁武松后获得',
  },
  {
    id: 'linchong-spear',
    name: '丈八蛇矛',
    emoji: '🏹',
    grade: '宝物',
    owner: '林冲',
    effect: '远程攻击时伤害 +50%，无视敌方护甲',
    description: '林冲豹子头的标志性武器，长达丈八，刺无不中。',
    obtained: false,
    obtainCondition: '完成"风雪山神庙"战役解锁林冲后获得',
  },
  {
    id: 'huyanzhuo-mace',
    name: '铁鞭',
    emoji: '🔱',
    grade: '宝物',
    owner: '呼延灼',
    effect: '连续攻击3次后，第4次必定眩晕敌方',
    description: '呼延灼的家传铁鞭，重达五十斤，专克盔甲。',
    obtained: false,
    obtainCondition: '完成"连环马阵"战役后获得',
  },
  {
    id: 'common-bow',
    name: '强弓',
    emoji: '🏹',
    grade: '凡品',
    owner: '花荣',
    effect: '远程攻击距离 +20%',
    description: '花荣小李广的随身弓箭，百步穿杨。',
    obtained: true,
    obtainCondition: '初始获得',
  },
  {
    id: 'common-shield',
    name: '藤牌',
    emoji: '🛡️',
    grade: '凡品',
    owner: '解珍',
    effect: '受到攻击时有30%概率格挡',
    description: '梁山步兵常用的藤制盾牌，轻便耐用。',
    obtained: true,
    obtainCondition: '初始获得',
  },
  {
    id: 'gongsun-fan',
    name: '羽扇',
    emoji: '🪭',
    grade: '宝物',
    owner: '公孙胜',
    effect: '施法时消耗体力减少50%，法术伤害 +40%',
    description: '公孙胜入云龙的道家羽扇，蕴含无穷法力。',
    obtained: false,
    obtainCondition: '累计活跃分钟数达到1000分钟后获得',
  },
  {
    id: 'chao-gai-staff',
    name: '禅杖',
    emoji: '🪄',
    grade: '神兵',
    owner: '鲁智深',
    effect: '花和尚专属，心率在有氧区间时，攻击力持续提升',
    description: '鲁智深花和尚的百斤禅杖，倒拔垂杨柳的神力所在。',
    obtained: false,
    obtainCondition: '累计步数达到100万步后获得',
  },
];

export const INITIAL_BATTLES: Battle[] = [
  {
    id: 1,
    name: '智取生辰纲',
    chapter: '第一章：聚义之始',
    location: '黄泥冈',
    narrative: '晁盖、吴用等七人设计劫取梁中书给蔡京的生辰纲，此乃梁山聚义之始。需积累足够步数，方能完成此次谋划。',
    enemyEmoji: '💰',
    enemyName: '杨志押运队',
    status: 'completed',
    unlockType: 'steps',
    unlockCondition: '累计步数达到 10,000 步',
    unlockGoal: 10000,
    unlockProgress: 10000,
    loyaltyReward: 200,
    weaponReward: false,
    unlockContent: '解锁吴用谋略加成',
  },
  {
    id: 2,
    name: '三打祝家庄',
    chapter: '第一章：聚义之始',
    location: '祝家庄',
    narrative: '梁山三次攻打祝家庄，历经艰辛终获全胜。需要连续三天保持运动习惯，方能模拟三打之势。',
    enemyEmoji: '🏯',
    enemyName: '祝家庄守军',
    status: 'active',
    unlockType: 'steps',
    unlockCondition: '连续3天步数达标',
    unlockGoal: 3,
    unlockProgress: 2,
    loyaltyReward: 350,
    weaponReward: false,
    unlockContent: '解锁扈三娘角色',
  },
  {
    id: 3,
    name: '大破连环马',
    chapter: '第二章：征战四方',
    location: '青州城外',
    narrative: '呼延灼率连环马阵攻打梁山，宋江命徐宁传授钩镰枪法破阵。需要高强度运动，心率达到燃脂区间方可破阵。',
    enemyEmoji: '🐎',
    enemyName: '呼延灼连环马',
    status: 'unlockable',
    unlockType: 'heartRate',
    unlockCondition: '心率达到燃脂区间（140-160bpm）持续20分钟',
    unlockGoal: 20,
    unlockProgress: 12,
    loyaltyReward: 500,
    weaponReward: true,
    unlockContent: '获得铁鞭宝物',
  },
  {
    id: 4,
    name: '攻打高唐州',
    chapter: '第二章：征战四方',
    location: '高唐州',
    narrative: '高廉施展妖法，梁山久攻不下，宋江请来公孙胜破法。需要优质睡眠养精蓄锐，方能请动入云龙。',
    enemyEmoji: '🔮',
    enemyName: '高廉妖法阵',
    status: 'locked',
    unlockType: 'sleep',
    unlockCondition: '连续5天深度睡眠超过2小时',
    unlockGoal: 5,
    unlockProgress: 0,
    loyaltyReward: 600,
    weaponReward: true,
    unlockContent: '获得羽扇宝物',
  },
  {
    id: 5,
    name: '景阳冈打虎',
    chapter: '第三章：英雄传说',
    location: '景阳冈',
    narrative: '武松醉打景阳冈猛虎，一举成名。需要单次运动消耗超过500千卡，方能重现打虎之勇。',
    enemyEmoji: '🐯',
    enemyName: '景阳冈猛虎',
    status: 'locked',
    unlockType: 'steps',
    unlockCondition: '单次运动消耗超过500千卡',
    unlockGoal: 500,
    unlockProgress: 0,
    loyaltyReward: 800,
    weaponReward: true,
    unlockContent: '解锁武松·行者',
  },
  {
    id: 6,
    name: '风雪山神庙',
    chapter: '第三章：英雄传说',
    location: '沧州草料场',
    narrative: '林冲被高俅陷害，风雪夜独守草料场，忍无可忍终于爆发。需要在寒冷天气中坚持运动，方能体会林冲之志。',
    enemyEmoji: '❄️',
    enemyName: '高俅爪牙',
    status: 'locked',
    unlockType: 'loyalty',
    unlockCondition: '忠义值达到5000（义薄云天境界）',
    unlockGoal: 5000,
    unlockProgress: 0,
    loyaltyReward: 1000,
    weaponReward: true,
    unlockContent: '解锁林冲·豹子头',
  },
];

export const INITIAL_SKILLS: Skill[] = [
  // 拳脚
  { id: 'iron-fist', name: '铁拳', emoji: '👊', branch: '拳脚', effect: '徒手攻击力 +20%', level: 2, maxLevel: 5, unlocked: true, unlockCondition: '初始解锁' },
  { id: 'tiger-claw', name: '虎爪功', emoji: '🐯', branch: '拳脚', effect: '攻击有10%概率造成流血', level: 1, maxLevel: 5, unlocked: true, unlockCondition: '初始解锁' },
  { id: 'iron-shirt', name: '铁布衫', emoji: '🛡️', branch: '拳脚', effect: '受到物理伤害减少15%', level: 0, maxLevel: 5, unlocked: false, unlockCondition: '连续7天步数达标' },
  // 刀枪
  { id: 'blade-dance', name: '刀法', emoji: '🗡️', branch: '刀枪', effect: '刀类武器攻击力 +25%', level: 3, maxLevel: 5, unlocked: true, unlockCondition: '初始解锁' },
  { id: 'spear-thrust', name: '枪法', emoji: '🏹', branch: '刀枪', effect: '穿刺攻击无视50%护甲', level: 1, maxLevel: 5, unlocked: true, unlockCondition: '初始解锁' },
  { id: 'hook-blade', name: '钩镰枪法', emoji: '⚔️', branch: '刀枪', effect: '专克骑兵，对骑兵伤害 ×3', level: 0, maxLevel: 3, unlocked: false, unlockCondition: '完成大破连环马战役' },
  // 弓箭
  { id: 'hundred-steps', name: '百步穿杨', emoji: '🎯', branch: '弓箭', effect: '远程攻击必定命中，伤害 +30%', level: 2, maxLevel: 5, unlocked: true, unlockCondition: '初始解锁' },
  { id: 'fire-arrow', name: '火箭', emoji: '🔥', branch: '弓箭', effect: '攻击附带燃烧效果，持续3回合', level: 0, maxLevel: 3, unlocked: false, unlockCondition: '累计活跃分钟数达到500分钟' },
  // 谋略
  { id: 'ambush', name: '伏兵之计', emoji: '🎭', branch: '谋略', effect: '战斗开始时有30%概率先手攻击', level: 2, maxLevel: 5, unlocked: true, unlockCondition: '初始解锁' },
  { id: 'fire-attack', name: '火攻', emoji: '🔥', branch: '谋略', effect: '对敌方全体造成范围伤害', level: 1, maxLevel: 3, unlocked: true, unlockCondition: '初始解锁' },
  { id: 'empty-city', name: '空城计', emoji: '🏯', branch: '谋略', effect: '受到致命攻击时有20%概率免疫', level: 0, maxLevel: 3, unlocked: false, unlockCondition: '连续5天深度睡眠达标' },
];

export const INITIAL_JOURNAL: JournalEntry[] = [
  {
    date: '3月18日',
    event: '今日步行12,500步，行走于梁山水泊之畔，感受到了江湖的气息。吴用军师为我讲解了智取生辰纲的谋划，忠义之心愈发坚定。',
    loyaltyGained: 125,
    milesGained: 125,
    battleCompleted: '智取生辰纲',
    mood: '豪情万丈',
  },
  {
    date: '3月19日',
    event: '清晨跑步6公里，心率维持在有氧区间，李逵兄弟说我今日如虎添翼。三打祝家庄第二日，已见胜利曙光。',
    loyaltyGained: 80,
    milesGained: 60,
    battleCompleted: null,
    mood: '斗志昂扬',
  },
  {
    date: '3月20日',
    event: '昨夜深度睡眠2.5小时，精神焕发。宋公明哥哥赞我养精蓄锐有道，忠义值大幅提升。恶念值降至最低，心境清明。',
    loyaltyGained: 110,
    milesGained: 90,
    battleCompleted: null,
    mood: '神清气爽',
  },
  {
    date: '3月21日',
    event: '今日未能完成步数目标，恶念稍有积累。但黑旋风李逵鼓励我说：明日再战，好汉不言败！',
    loyaltyGained: 30,
    milesGained: 45,
    battleCompleted: null,
    mood: '略感愧疚',
  },
  {
    date: '3月22日',
    event: '高强度间歇训练，心率峰值达到175bpm，李逵狂暴状态激活，战力大增！三打祝家庄即将告捷。',
    loyaltyGained: 150,
    milesGained: 110,
    battleCompleted: null,
    mood: '热血沸腾',
  },
];

export const INITIAL_GAME_STATE: GameState = {
  playerName: '梁山好汉',
  loyaltyValue: 1580,
  loyaltyLevel: '小有名气',
  evilValue: 15,
  totalMiles: 2340,
  consecutiveDays: 5,
  currentBattle: 2,
  completedBattles: [1],

  dailyHealth: {
    date: TODAY,
    steps: 7823,
    stepGoal: 10000,
    heartRateAvg: 72,
    heartRateMax: 142,
    sleepHours: 7.2,
    sleepDeepHours: 1.8,
    caloriesBurned: 312,
    activeMinutes: 38,
  },

  weeklySteps: [12500, 8200, 11800, 3200, 9600, 14200, 7823],
  loyaltyHistory: [800, 950, 1100, 1200, 1350, 1450, 1580],

  heroes: INITIAL_HEROES,
  weapons: INITIAL_WEAPONS,
  battles: INITIAL_BATTLES,
  skills: INITIAL_SKILLS,
  journalEntries: INITIAL_JOURNAL,

  watchState: {
    currentScreen: 'dial',
    currentHeartRate: 72,
    workoutActive: false,
    workoutTime: 0,
    workoutCalories: 0,
    workoutMiles: 0,
    battleEnemyHp: 600,
    battleHeroHp: 1000,
    battleEnemyName: '祝家庄守将',
    battleEnemyEmoji: '🏯',
    battleLog: ['梁山大军压境，战鼓震天！', '鲁智深挥舞禅杖，冲入敌阵！'],
  },
};
