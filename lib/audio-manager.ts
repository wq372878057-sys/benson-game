import { useAudioPlayer } from 'expo-audio';
import { setAudioModeAsync } from 'expo-audio';
import { Platform } from 'react-native';

interface AudioPlayer {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  release: () => Promise<void>;
  playing: boolean;
  volume: number;
  loop: boolean;
}

export class AudioManager {
  private static instance: AudioManager;
  private shootPlayer: AudioPlayer | null = null;
  private hitPlayer: AudioPlayer | null = null;
  private backgroundPlayer: AudioPlayer | null = null;
  private isInitialized = false;
  private isMuted = false;

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // 设置音频模式 - 允许在静音模式下播放
      if (Platform.OS !== 'web') {
        await setAudioModeAsync({
          playsInSilentMode: true,
        });
      }

      console.log('✓ 音效管理系统初始化成功');
      this.isInitialized = true;
    } catch (error) {
      console.error('音效初始化失败:', error);
    }
  }

  // 设置射击音效播放器
  setShootPlayer(player: AudioPlayer): void {
    this.shootPlayer = player;
  }

  // 设置消灭音效播放器
  setHitPlayer(player: AudioPlayer): void {
    this.hitPlayer = player;
  }

  // 设置背景音乐播放器
  setBackgroundPlayer(player: AudioPlayer): void {
    this.backgroundPlayer = player;
  }

  async playShootSound(): Promise<void> {
    if (this.isMuted || !this.shootPlayer) return;

    try {
      // 停止当前播放并重新开始
      if (this.shootPlayer.playing) {
        await this.shootPlayer.pause();
      }
      await this.shootPlayer.play();
    } catch (error) {
      console.error('播放射击音效失败:', error);
    }
  }

  async playHitSound(): Promise<void> {
    if (this.isMuted || !this.hitPlayer) return;

    try {
      // 停止当前播放并重新开始
      if (this.hitPlayer.playing) {
        await this.hitPlayer.pause();
      }
      await this.hitPlayer.play();
    } catch (error) {
      console.error('播放消灭音效失败:', error);
    }
  }

  async playBackgroundMusic(): Promise<void> {
    if (this.isMuted || !this.backgroundPlayer) return;

    try {
      // 设置背景音乐为循环播放
      this.backgroundPlayer.loop = true;
      this.backgroundPlayer.volume = 0.3; // 降低背景音乐音量
      await this.backgroundPlayer.play();
      console.log('✓ 背景音乐开始播放');
    } catch (error) {
      console.error('播放背景音乐失败:', error);
    }
  }

  async stopBackgroundMusic(): Promise<void> {
    if (!this.backgroundPlayer) return;

    try {
      await this.backgroundPlayer.stop();
      console.log('✓ 背景音乐已停止');
    } catch (error) {
      console.error('停止背景音乐失败:', error);
    }
  }

  async pauseBackgroundMusic(): Promise<void> {
    if (!this.backgroundPlayer) return;

    try {
      await this.backgroundPlayer.pause();
    } catch (error) {
      console.error('暂停背景音乐失败:', error);
    }
  }

  async resumeBackgroundMusic(): Promise<void> {
    if (!this.backgroundPlayer) return;

    try {
      await this.backgroundPlayer.play();
    } catch (error) {
      console.error('恢复背景音乐失败:', error);
    }
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    console.log(`🔊 音效${muted ? '已关闭' : '已开启'}`);
  }

  isSoundMuted(): boolean {
    return this.isMuted;
  }

  async cleanup(): Promise<void> {
    try {
      if (this.shootPlayer) {
        await this.shootPlayer.release();
      }
      if (this.hitPlayer) {
        await this.hitPlayer.release();
      }
      if (this.backgroundPlayer) {
        await this.backgroundPlayer.release();
      }
      this.isInitialized = false;
      console.log('✓ 音效资源已清理');
    } catch (error) {
      console.error('清理音效资源失败:', error);
    }
  }
}

export const audioManager = AudioManager.getInstance();
