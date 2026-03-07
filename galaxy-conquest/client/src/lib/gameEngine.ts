// ============================================================
// 星球大战：银河征服者 - 游戏引擎
// Design: 星云漂流者 (Nebula Drifter)
// ============================================================

import type {
  GameState, Character, Gear, Mission, Skill,
  DailyData, HeartRateZone, ForceAlignment
} from './gameTypes';

// ---- 常量 ----
export const STEP_TO_LIGHT_YEAR = 100; // 100步 = 1光年
export const STEPS_PER_FORCE = 1000; // 每1000步 = 10原力点
export const DAILY_STEP_GOAL = 10000;

export const FORCE_LEVELS = [
  { level: 1, name: '原力感知者', min: 0, max: 1000, dailySupply: 1 },
  { level: 2, name: '学徒', min: 1001, max: 5000, dailySupply: 2 },
  { level: 3, name: '武士', min: 5001, max: 15000, dailySupply: 3 },
  { level: 4, name: '骑士', min: 15001, max: 30000, dailySupply: 4 },
  { level: 5, name: '大师', min: 30001, max: 50000, dailySupply: 5 },
  { level: 6, name: '议会成员', min: 50001, max: 80000, dailySupply: 6 },
  { level: 7, name: '大绝地', min: 80001, max: Infinity, dailySupply: 8 },
];

export function getForceLevel(points: number) {
  return FORCE_LEVELS.find(l => points >= l.min && points <= l.max) || FORCE_LEVELS[0];
}

export function getHeartRateZone(bpm: number): HeartRateZone {
  if (bpm < 100) return 'rest';
  if (bpm < 120) return 'warmup';
  if (bpm < 140) return 'aerobic';
  if (bpm < 160) return 'fatburn';
  if (bpm < 180) return 'anaerobic';
  return 'max';
}

export function getHeartRateZoneName(zone: HeartRateZone): string {
  const names: Record<HeartRateZone, string> = {
    rest: '静息', warmup: '热身', aerobic: '有氧',
    fatburn: '燃脂', anaerobic: '无氧', max: '极限'
  };
  return names[zone];
}

export function getAttackMultiplier(bpm: number): number {
  if (bpm < 130) return 1.0;
  if (bpm < 160) return 1.2;
  return 1.5;
}

export function calcSleepScore(sleepHours: number, deepHours: number): number {
  return Math.round(Math.min(sleepHours / 8, 1) * 60 + Math.min(deepHours / 2, 1) * 40);
}

export function calcDailyForce(steps: number, sleepHours: number, deepHours: number, consecutiveDays: number): number {
  const stepForce = Math.min(Math.floor(steps / STEPS_PER_FORCE) * 10, 100);
  const sleepBonus = deepHours >= 2 ? 30 : 0;
  let streakBonus = 0;
  if (consecutiveDays >= 7) streakBonus = 20;
  else if (consecutiveDays >= 3) streakBonus = 10;
  return stepForce + sleepBonus + streakBonus;
}

export function getForceAlignment(light: number, dark: number): ForceAlignment {
  const ratio = light / (light + dark + 1);
  if (ratio > 0.65) return 'light';
  if (ratio < 0.35) return 'dark';
  return 'balanced';
}

// ---- 初始角色数据 ----
const initialCharacters: Character[] = [
  {
    id: 'player',
    name: '拾荒者',
    title: '贾库废墟之子',
    level: 3,
    hp: 85,
    maxHp: 100,
    strength: 45,
    agility: 52,
    endurance: 38,
    forceAffinity: 60,
    combatRole: '全能适应',
    status: 'energized',
    equippedGearId: 'scavenger-kit',
    avatar: '🧑‍🚀',
    description: '出生于贾库废墟，没有任何背景与权势，仅凭一身潜力与不屈的意志踏上征服银河之路。',
    specialAbility: '原力感知 - 提前感知前方危险',
  },
  {
    id: 'r7',
    name: '机器人 R7',
    title: '废旧飞船导航员',
    level: 2,
    hp: 60,
    maxHp: 80,
    strength: 20,
    agility: 35,
    endurance: 70,
    forceAffinity: 10,
    combatRole: '耐力/导航',
    status: 'focused',
    equippedGearId: undefined,
    avatar: '🤖',
    description: '从废旧飞船残骸中修复的导航机器人，步数越多，导航精度越高。',
    specialAbility: '精准导航 - 解锁更多星图区域',
  },
  {
    id: 'jedi',
    name: '流亡绝地武士',
    title: '科洛桑幸存者',
    level: 5,
    hp: 90,
    maxHp: 120,
    strength: 65,
    agility: 70,
    endurance: 55,
    forceAffinity: 90,
    combatRole: '精神力/冥想',
    status: 'focused',
    equippedGearId: 'jedi-robe',
    avatar: '🧙',
    description: '帝国清洗中幸存的绝地武士，冥想时间越长，原力感知越强。',
    specialAbility: '深度冥想 - 提升原力感知与任务指引',
  },
  {
    id: 'mandalorian',
    name: '曼达洛猎人',
    title: '赏金猎人',
    level: 4,
    hp: 100,
    maxHp: 110,
    strength: 80,
    agility: 65,
    endurance: 75,
    forceAffinity: 5,
    combatRole: '爆发力/精准',
    status: 'energized',
    equippedGearId: 'mandalorian-armor',
    avatar: '⚔️',
    description: '来自曼达洛星的赏金猎人，心率峰值越高，战斗技能越强。',
    specialAbility: '精准射击 - 心率>160bpm时触发爆发攻击',
  },
];

// ---- 初始装备数据 ----
const initialGear: Gear[] = [
  { id: 'skywalker-saber', name: '天行者光剑', rarity: 'legendary', effect: '力量 +50，暴击率 +20%', holder: '—', obtainMethod: '通关第50关', icon: '⚡', equipped: false, unlocked: false },
  { id: 'mandalorian-armor', name: '曼达洛盔甲', rarity: 'legendary', effect: '防御 +40，反弹伤害', holder: '曼达洛猎人', obtainMethod: '通关第35关', icon: '🛡️', equipped: true, unlocked: true },
  { id: 'kyber-purple', name: '凯伯水晶（紫色）', rarity: 'legendary', effect: '特殊技能：原力共鸣', holder: '—', obtainMethod: '通关第25关', icon: '💎', equipped: false, unlocked: false },
  { id: 'falcon-core', name: '千年隼核心', rarity: 'legendary', effect: '飞船速度 +100%，解锁隐藏星域', holder: '—', obtainMethod: '通关第50关', icon: '🚀', equipped: false, unlocked: false },
  { id: 'jedi-robe', name: '绝地长袍', rarity: 'elite', effect: '原力感知 +30，冥想效果 +50%', holder: '绝地武士', obtainMethod: '通关第35关', icon: '👘', equipped: true, unlocked: true },
  { id: 'blaster-mod', name: '爆能枪（改装版）', rarity: 'elite', effect: '远程攻击 +40，穿透护甲', holder: '赏金猎人', obtainMethod: '完成20次HIIT', icon: '🔫', equipped: false, unlocked: false },
  { id: 'shield-gen', name: '飞船护盾发生器', rarity: 'elite', effect: '太空战斗防御 +30', holder: '—', obtainMethod: '连续训练30天', icon: '🔮', equipped: false, unlocked: false },
  { id: 'force-glove', name: '原力手套', rarity: 'elite', effect: '原力技能消耗 -20%', holder: '—', obtainMethod: '原力达到「骑士」', icon: '🧤', equipped: false, unlocked: false },
  { id: 'scavenger-kit', name: '拾荒者工具包', rarity: 'common', effect: '探索时额外获得银河信用点', holder: '玩家', obtainMethod: '初始持有', icon: '🔧', equipped: true, unlocked: true },
  { id: 'flight-helmet', name: '基础飞行头盔', rarity: 'common', effect: '飞行任务中防御 +10', holder: '—', obtainMethod: '初始持有', icon: '⛑️', equipped: false, unlocked: true },
];

// ---- 初始任务数据 ----
const initialMissions: Mission[] = [
  {
    id: 1, name: '逃离废墟', location: '贾库星', sector: '外围星域',
    unlockCondition: '完成新手引导', unlockType: 'tutorial', unlockProgress: 1, unlockTarget: 1,
    reward: { forcePoints: 50, unlock: '飞船系统' },
    narrative: '废旧飞船残骸中，你感受到了原力的第一次呼唤。帝国侦察机正在接近，你必须立即逃离贾库星。',
    status: 'completed', bossName: '帝国侦察兵', bossHp: 50, bossMaxHp: 50
  },
  {
    id: 5, name: '寻找原力', location: '塔图因', sector: '外围星域',
    unlockCondition: '累计航行 500 光年', unlockType: 'steps', unlockProgress: 487, unlockTarget: 500,
    reward: { forcePoints: 100, unlock: '流亡绝地武士' },
    narrative: '在塔图因的双日落下，一位神秘老人告诉你：原力与你同在。你必须找到凯伯水晶的下落。',
    status: 'active', bossName: '沙漠土匪头目', bossHp: 120, bossMaxHp: 120
  },
  {
    id: 10, name: '铸造光剑', location: '伊冷星', sector: '中心星域',
    unlockCondition: '完成一次心率 >150bpm 训练', unlockType: 'heartrate', unlockProgress: 0, unlockTarget: 1,
    reward: { forcePoints: 150, unlock: '光剑工坊' },
    narrative: '在伊冷星的熔岩洞穴中，你找到了凯伯水晶。但铸造光剑需要极大的专注与力量——只有在原力爆发的状态下才能完成。',
    status: 'available', bossName: '熔岩守卫', bossHp: 200, bossMaxHp: 200
  },
  {
    id: 18, name: '招募猎人', location: '曼达洛', sector: '外围星域',
    unlockCondition: '连续 3 天完成步数目标', unlockType: 'combined', unlockProgress: 1, unlockTarget: 3,
    reward: { forcePoints: 150, unlock: '曼达洛赏金猎人' },
    narrative: '曼达洛星的赏金猎人公会有你需要的盟友。但他只接受真正有实力的委托人——你必须证明自己的坚持与耐力。',
    status: 'available', bossName: '公会守卫', bossHp: 180, bossMaxHp: 180
  },
  {
    id: 25, name: '深度冥想', location: '阿奇托星', sector: '核心星域',
    unlockCondition: '连续 3 天睡眠 >7 小时', unlockType: 'sleep', unlockProgress: 2, unlockTarget: 3,
    reward: { forcePoints: 200, gear: '凯伯水晶（蓝色）' },
    narrative: '阿奇托星是原力的圣地。在这里，你必须进入深度冥想，与原力合一，才能获得传说中的蓝色凯伯水晶。',
    status: 'locked', bossName: '黑暗幻象', bossHp: 250, bossMaxHp: 250
  },
  {
    id: 35, name: '对抗裁判官', location: '达索米尔', sector: '外围星域',
    unlockCondition: '完成 10 次有氧运动', unlockType: 'combined', unlockProgress: 3, unlockTarget: 10,
    reward: { forcePoints: 300, gear: '绝地长袍', unlock: '技能树' },
    narrative: '帝国裁判官追踪到了你的位置。在达索米尔的红色雾霭中，一场命运之战即将开始。',
    status: 'locked', bossName: '帝国裁判官', bossHp: 400, bossMaxHp: 400
  },
  {
    id: 50, name: '摧毁死星', location: '雅文四号', sector: '核心星域',
    unlockCondition: '本周步数超过 50,000 步', unlockType: 'steps', unlockProgress: 0, unlockTarget: 50000,
    reward: { forcePoints: 500, gear: '千年隼核心' },
    narrative: '帝国的终极武器——死星——即将向反抗军基地开火。你只有一次机会，在原力的引导下，摧毁它。',
    status: 'locked', bossName: '帝国大将', bossHp: 800, bossMaxHp: 800
  },
  {
    id: 65, name: '面对黑暗', location: '穆斯塔法', sector: '外围星域',
    unlockCondition: '原力达到「大师」等级', unlockType: 'combined', unlockProgress: 0, unlockTarget: 1,
    reward: { forcePoints: 800, unlock: '黑暗面最终技能' },
    narrative: '在穆斯塔法的熔岩星球上，你将面对自己内心最深处的黑暗。这是成为真正绝地大师的最后考验。',
    status: 'locked', bossName: '西斯学徒', bossHp: 1200, bossMaxHp: 1200
  },
  {
    id: 81, name: '银河命运', location: '科洛桑', sector: '核心星域',
    unlockCondition: '完成所有主线试炼', unlockType: 'combined', unlockProgress: 0, unlockTarget: 80,
    reward: { forcePoints: 9999, unlock: '二周目' },
    narrative: '银河的命运悬于一线。科洛桑的绝地圣殿中，最终的决战即将到来。你的选择，将决定整个星系的未来。',
    status: 'locked', bossName: '西斯尊主', bossHp: 9999, bossMaxHp: 9999
  },
];

// ---- 初始技能数据 ----
const initialSkills: Skill[] = [
  { id: 'force-sense', name: '原力感知', side: 'light', cost: 10, effect: '探路：提前得知前方是福缘还是遭遇战', unlocked: true, icon: '👁️', unlockCondition: '初始解锁' },
  { id: 'force-heal', name: '原力治疗', side: 'light', cost: 20, effect: '恢复：运动后加速体力恢复，船员状态提升', unlocked: true, icon: '💚', unlockCondition: '初始解锁' },
  { id: 'mind-peace', name: '心灵祥和', side: 'light', cost: 25, effect: '净化：主动降低黑暗原力 15 点', unlocked: false, icon: '☮️', unlockCondition: '原力达到「武士」' },
  { id: 'force-push', name: '原力推动', side: 'light', cost: 30, effect: '加速：当日银河光年 +50%', unlocked: false, icon: '💨', unlockCondition: '原力达到「骑士」' },
  { id: 'force-barrier', name: '原力屏障', side: 'light', cost: 50, effect: '防御：在战斗中抵挡一次致命伤害', unlocked: false, icon: '🛡️', unlockCondition: '原力达到「大师」' },
  { id: 'force-resonance', name: '原力共鸣', side: 'light', cost: 80, effect: '协同：触发全员协同加成，持续 1 天', unlocked: false, icon: '✨', unlockCondition: '原力达到「议会成员」' },
  { id: 'dark-sense', name: '黑暗感知', side: 'dark', cost: 10, effect: '威慑：降低敌方 BOSS 的攻击力', unlocked: false, icon: '🌑', unlockCondition: '黑暗侵蚀 >30' },
  { id: 'force-lightning', name: '原力闪电', side: 'dark', cost: 25, effect: '高伤害：对 BOSS 造成 3 倍伤害（一次性）', unlocked: false, icon: '⚡', unlockCondition: '黑暗侵蚀 >50' },
  { id: 'choke-control', name: '锁喉控制', side: 'dark', cost: 30, effect: '控制：使敌人无法行动 2 回合', unlocked: false, icon: '🤜', unlockCondition: '黑暗侵蚀 >60' },
  { id: 'dark-rage', name: '黑暗狂怒', side: 'dark', cost: 50, effect: '爆发：短时大幅提升攻击力，但黑暗原力 +20', unlocked: false, icon: '😤', unlockCondition: '黑暗侵蚀 >70' },
];

function generateDailyData(): DailyData[] {
  const data: DailyData[] = [];
  const now = new Date();
  const narrativeEvents = [
    '在原力冥想中，你感受到了遥远星球的呼唤',
    '帝国侦察机在附近区域出现，保持警惕',
    'R7探测到一处古老的绝地遗迹信号',
    '曼达洛猎人传来了新的赏金任务情报',
    '银河信用点市场波动，贸易路线调整中',
    '原力在你身边流动，今日感知异常清晰',
    '黑暗面的低语在夜晚变得更加清晰',
  ];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const steps = Math.floor(7000 + Math.random() * 6000);
    const sleepHours = 5.5 + Math.random() * 3;
    const deepHours = 1 + Math.random() * 1.5;
    const forceGained = calcDailyForce(steps, sleepHours, deepHours, 7 - i);
    data.push({
      date: date.toISOString().split('T')[0],
      steps,
      heartRateAvg: Math.floor(65 + Math.random() * 30),
      sleepHours: Math.round(sleepHours * 10) / 10,
      sleepDeepHours: Math.round(deepHours * 10) / 10,
      caloriesBurned: Math.floor(1800 + Math.random() * 800),
      activeMinutes: Math.floor(30 + Math.random() * 60),
      lightYears: Math.floor(steps / STEP_TO_LIGHT_YEAR),
      forceGained,
      events: [narrativeEvents[Math.floor(Math.random() * narrativeEvents.length)]],
    });
  }
  return data;
}

export function createInitialGameState(): GameState {
  const dailyData = generateDailyData();
  const today = dailyData[dailyData.length - 1];
  today.steps = 6842;
  today.heartRateAvg = 72;

  const initialLightPoints = 3280;
  const levelInfo = getForceLevel(initialLightPoints);

  return {
    force: {
      lightSidePoints: initialLightPoints,
      darkSidePoints: 18,
      forceLevel: levelInfo.level,
      forceLevelName: levelInfo.name,
      forceAlignment: getForceAlignment(initialLightPoints, 18),
      darkSideWarning: false,
      consecutiveDays: 7,
    },
    characters: initialCharacters,
    gear: initialGear,
    skills: initialSkills,
    missions: initialMissions,
    training: {
      active: false,
      type: 'lightsaber',
      typeName: '光剑格斗',
      duration: 0,
      heartRate: 72,
      heartRateZone: 'rest',
      calories: 0,
      lightYears: 0,
    },
    battle: {
      active: false,
      bossName: '',
      bossHp: 0,
      bossMaxHp: 0,
      playerHp: 100,
      playerMaxHp: 100,
      heartRate: 72,
      attackMultiplier: 1.0,
      log: [],
      result: null,
    },
    galaxy: {
      totalLightYears: 4872,
      currentLightYears: 487,
      stageGoalLightYears: 500,
      currentMission: 5,
      currentSector: '外围星域 · 塔图因',
      completedMissions: [1],
      ship: {
        engine: 2,
        shield: 1,
        weapons: 1,
        hyperdrive: false,
      },
    },
    today: {
      steps: today.steps,
      lightYears: Math.floor(today.steps / STEP_TO_LIGHT_YEAR),
      forceGained: today.forceGained,
      caloriesBurned: today.caloriesBurned,
      activeMinutes: today.activeMinutes,
      heartRateAvg: today.heartRateAvg,
      sleepHours: today.sleepHours,
      sleepDeepHours: today.sleepDeepHours,
    },
    dailyData,
    credits: 2840,
    darkMode: true,
  };
}
