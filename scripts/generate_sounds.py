#!/usr/bin/env python3
"""
生成游戏音效文件
- shoot.mp3: 激光射击音效
- hit.mp3: 敌人消灭音效
- background.mp3: 背景音乐
"""

import numpy as np
from scipy.io import wavfile
import os

def generate_shoot_sound(filename, duration=0.2, sample_rate=44100):
    """生成激光射击音效"""
    t = np.linspace(0, duration, int(sample_rate * duration))
    # 从高频到低频的扫描音效
    freq_start = 800
    freq_end = 200
    freq = np.linspace(freq_start, freq_end, len(t))
    
    # 生成音波
    phase = 2 * np.pi * np.cumsum(freq) / sample_rate
    sound = np.sin(phase)
    
    # 添加包络（快速衰减）
    envelope = np.exp(-t / (duration * 0.5))
    sound = sound * envelope
    
    # 归一化
    sound = np.int16(sound / np.max(np.abs(sound)) * 32767 * 0.8)
    
    wavfile.write(filename, sample_rate, sound)
    print(f"✓ 生成射击音效: {filename}")

def generate_hit_sound(filename, duration=0.3, sample_rate=44100):
    """生成敌人消灭音效"""
    t = np.linspace(0, duration, int(sample_rate * duration))
    
    # 多个频率的组合
    freq1 = 400
    freq2 = 600
    freq3 = 300
    
    # 生成三层音波
    sound1 = np.sin(2 * np.pi * freq1 * t)
    sound2 = np.sin(2 * np.pi * freq2 * t) * 0.6
    sound3 = np.sin(2 * np.pi * freq3 * t) * 0.4
    
    sound = (sound1 + sound2 + sound3) / 3
    
    # 添加包络（快速上升，缓慢衰减）
    attack = 0.05
    decay = duration - attack
    envelope = np.concatenate([
        np.linspace(0, 1, int(sample_rate * attack)),
        np.exp(-np.linspace(0, 3, int(sample_rate * decay)))
    ])
    
    sound = sound * envelope
    
    # 归一化
    sound = np.int16(sound / np.max(np.abs(sound)) * 32767 * 0.8)
    
    wavfile.write(filename, sample_rate, sound)
    print(f"✓ 生成消灭音效: {filename}")

def generate_background_music(filename, duration=10, sample_rate=44100):
    """生成背景音乐（简单的循环旋律）"""
    t = np.linspace(0, duration, int(sample_rate * duration))
    
    # 定义音符频率 (C大调)
    notes = {
        'C': 262,
        'D': 294,
        'E': 330,
        'F': 349,
        'G': 392,
        'A': 440,
        'B': 494,
    }
    
    # 旋律序列
    melody = ['C', 'E', 'G', 'E', 'C', 'D', 'F', 'D', 'G', 'B', 'G', 'E']
    
    sound = np.zeros(len(t))
    note_duration = duration / len(melody)
    samples_per_note = int(sample_rate * note_duration)
    
    for i, note in enumerate(melody):
        start_idx = i * samples_per_note
        end_idx = min((i + 1) * samples_per_note, len(t))
        
        note_t = np.linspace(0, note_duration, end_idx - start_idx)
        freq = notes[note]
        
        # 生成音符
        note_sound = np.sin(2 * np.pi * freq * note_t)
        
        # 添加包络
        envelope = np.concatenate([
            np.linspace(0, 1, int(len(note_t) * 0.1)),
            np.ones(int(len(note_t) * 0.7)),
            np.linspace(1, 0, int(len(note_t) * 0.2))
        ])
        
        # 确保长度匹配
        if len(envelope) > len(note_sound):
            envelope = envelope[:len(note_sound)]
        elif len(envelope) < len(note_sound):
            envelope = np.concatenate([envelope, np.zeros(len(note_sound) - len(envelope))])
        
        note_sound = note_sound * envelope
        sound[start_idx:end_idx] = note_sound
    
    # 添加低音伴奏
    bass_freq = 110  # A2
    bass = np.sin(2 * np.pi * bass_freq * t) * 0.3
    bass_envelope = np.concatenate([
        np.linspace(0, 1, int(sample_rate * 0.1)),
        np.ones(int(sample_rate * (duration - 0.2))),
        np.linspace(1, 0, int(sample_rate * 0.1))
    ])
    bass = bass * bass_envelope
    
    sound = sound + bass
    
    # 归一化
    sound = np.int16(sound / np.max(np.abs(sound)) * 32767 * 0.6)
    
    wavfile.write(filename, sample_rate, sound)
    print(f"✓ 生成背景音乐: {filename}")

if __name__ == '__main__':
    output_dir = '/home/ubuntu/survivor-rogue-game/assets/sounds'
    os.makedirs(output_dir, exist_ok=True)
    
    print("🎵 生成游戏音效...")
    generate_shoot_sound(f'{output_dir}/shoot.wav')
    generate_hit_sound(f'{output_dir}/hit.wav')
    generate_background_music(f'{output_dir}/background.wav')
    print("\n✅ 所有音效生成完成！")
