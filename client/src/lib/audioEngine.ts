/**
 * 禅定花园 · Web Audio 音效引擎
 * 程序化合成拨珠音效和背景音乐，无需外部音频文件
 */

let audioContext: AudioContext | null = null;
let bgMusicNodes: { oscillators: OscillatorNode[]; gainNode: GainNode } | null = null;
let bgMusicEnabled = false;
let currentMusicTheme = '';

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

/**
 * 拨珠音效 - 程序化合成
 */
export function playBeadSound(
  freq: number,
  type: OscillatorType,
  duration: number,
  isMother = false
): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      freq * 0.6,
      ctx.currentTime + duration / 1000
    );

    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(isMother ? freq * 3 : freq * 2, ctx.currentTime);
    filterNode.Q.setValueAtTime(1, ctx.currentTime);

    const volume = isMother ? 0.35 : 0.25;
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);

    // 母珠额外添加泛音
    if (isMother) {
      const overtone = ctx.createOscillator();
      const overtoneGain = ctx.createGain();
      overtone.connect(overtoneGain);
      overtoneGain.connect(ctx.destination);
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 2, ctx.currentTime);
      overtone.frequency.exponentialRampToValueAtTime(freq * 1.2, ctx.currentTime + duration / 1000);
      overtoneGain.gain.setValueAtTime(0.15, ctx.currentTime);
      overtoneGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
      overtone.start(ctx.currentTime);
      overtone.stop(ctx.currentTime + duration / 1000);
    }
  } catch (e) {
    // 静默失败
  }
}

/**
 * 升级音效 - 三层叠加：低频钟声 + 高频泛音 + 短促钟鸣
 */
export function playLevelUpSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 层1: 低频钟声（庄严感）
    const bell1 = ctx.createOscillator();
    const bell1Gain = ctx.createGain();
    bell1.connect(bell1Gain);
    bell1Gain.connect(ctx.destination);
    bell1.type = 'sine';
    bell1.frequency.setValueAtTime(220, now);
    bell1.frequency.exponentialRampToValueAtTime(110, now + 2);
    bell1Gain.gain.setValueAtTime(0.4, now);
    bell1Gain.gain.exponentialRampToValueAtTime(0.001, now + 2);
    bell1.start(now);
    bell1.stop(now + 2);

    // 层2: 高频泛音（神圣感）
    const bell2 = ctx.createOscillator();
    const bell2Gain = ctx.createGain();
    bell2.connect(bell2Gain);
    bell2Gain.connect(ctx.destination);
    bell2.type = 'sine';
    bell2.frequency.setValueAtTime(880, now + 0.1);
    bell2.frequency.exponentialRampToValueAtTime(440, now + 1.5);
    bell2Gain.gain.setValueAtTime(0, now);
    bell2Gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    bell2Gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    bell2.start(now);
    bell2.stop(now + 1.5);

    // 层3: 短促钟鸣（仪式感）
    [0, 0.3, 0.6].forEach((delay, i) => {
      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chime.type = 'triangle';
      chime.frequency.setValueAtTime(660 + i * 110, now + delay);
      chimeGain.gain.setValueAtTime(0.3, now + delay);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.4);
      chime.start(now + delay);
      chime.stop(now + delay + 0.4);
    });
  } catch (e) {
    // 静默失败
  }
}

/**
 * 每100颗触发的仪式振动音效（模拟）
 */
export function playRoundCompleteSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    [0, 0.15].forEach(delay => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now + delay);
      osc.frequency.exponentialRampToValueAtTime(264, now + delay + 0.3);
      gain.gain.setValueAtTime(0.3, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.3);
      osc.start(now + delay);
      osc.stop(now + delay + 0.3);
    });
  } catch (e) {
    // 静默失败
  }
}

/**
 * 背景音乐系统 - 程序化合成
 */
type MusicTheme = 'dawn-bell' | 'brahma-chant' | 'lotus-pond' | 'celestial-music';

const MUSIC_CONFIGS: Record<MusicTheme, { notes: number[]; tempo: number; volume: number }> = {
  'dawn-bell': {
    notes: [110, 146.83, 164.81, 220, 293.66],
    tempo: 4000,
    volume: 0.08,
  },
  'brahma-chant': {
    notes: [174.61, 196, 220, 261.63, 329.63],
    tempo: 3000,
    volume: 0.07,
  },
  'lotus-pond': {
    notes: [261.63, 293.66, 329.63, 392, 440, 523.25],
    tempo: 2500,
    volume: 0.06,
  },
  'celestial-music': {
    notes: [392, 440, 493.88, 523.25, 587.33, 659.25, 783.99],
    tempo: 2000,
    volume: 0.05,
  },
};

let musicInterval: ReturnType<typeof setInterval> | null = null;
let noteIndex = 0;

export function startBackgroundMusic(theme: MusicTheme): void {
  stopBackgroundMusic();
  bgMusicEnabled = true;
  currentMusicTheme = theme;
  
  const config = MUSIC_CONFIGS[theme] || MUSIC_CONFIGS['dawn-bell'];
  noteIndex = 0;

  const playNote = () => {
    if (!bgMusicEnabled) return;
    try {
      const ctx = getAudioContext();
      const note = config.notes[noteIndex % config.notes.length];
      noteIndex++;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const reverb = ctx.createConvolver();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(config.volume, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.tempo / 1000 * 0.8);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + config.tempo / 1000);
    } catch (e) {
      // 静默失败
    }
  };

  playNote();
  musicInterval = setInterval(playNote, config.tempo);
}

export function stopBackgroundMusic(): void {
  bgMusicEnabled = false;
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
}

export function toggleBackgroundMusic(theme: MusicTheme): boolean {
  if (bgMusicEnabled) {
    stopBackgroundMusic();
    return false;
  } else {
    startBackgroundMusic(theme);
    return true;
  }
}

export function isMusicPlaying(): boolean {
  return bgMusicEnabled;
}

export function setMusicTheme(theme: string): void {
  if (bgMusicEnabled) {
    startBackgroundMusic(theme as MusicTheme);
  }
}
