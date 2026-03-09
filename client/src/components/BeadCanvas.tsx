/**
 * 禅定花园 · 佛珠拨动界面
 * 俯视角佛珠渲染 + 弹簧-阻尼物理引擎
 * Design Philosophy: 金碧禅境 - 仪式感设计，阻尼物理反馈模拟真实念珠
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useZen } from '@/contexts/ZenContext';
import { BEAD_STYLES, ZEN_LEVELS } from '@/lib/zenStore';

const BEAD_COUNT = 18;
const SPRING_STIFFNESS = 0.22;
const DAMPING = 0.72;
const DRAG_RESISTANCE = 0.88;

interface Bead {
  angle: number; // 在椭圆上的角度（弧度）
  velocity: number;
  isMother: boolean;
  scale: number;
  glowing: boolean;
}

interface ParticleEffect {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface BeadCanvasProps {
  isWatch?: boolean;
  size?: number;
}

export default function BeadCanvas({ isWatch = false, size = 320 }: BeadCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, addMerit } = useZen();
  const beadsRef = useRef<Bead[]>([]);
  const particlesRef = useRef<ParticleEffect[]>([]);
  const animFrameRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const lastTouchXRef = useRef(0);
  const lastTouchYRef = useRef(0);
  const rotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const lastClickTimeRef = useRef(0);
  const [currentBeadStyle] = useState(() => BEAD_STYLES.find(b => b.id === state.selectedBead) || BEAD_STYLES[0]);

  const beadStyle = BEAD_STYLES.find(b => b.id === state.selectedBead) || BEAD_STYLES[0];
  const levelInfo = ZEN_LEVELS.find(l => l.level === state.currentLevel) || ZEN_LEVELS[0];

  // 初始化珠子
  useEffect(() => {
    beadsRef.current = Array.from({ length: BEAD_COUNT }, (_, i) => ({
      angle: (i / BEAD_COUNT) * Math.PI * 2,
      velocity: 0,
      isMother: i === 0,
      scale: 1,
      glowing: false,
    }));
  }, []);

  // 添加粒子效果
  const addParticles = useCallback((x: number, y: number, color: string, count = 8) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 0.5 + Math.random() * 2;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 0.6 + Math.random() * 0.4,
        color,
        size: 1 + Math.random() * 3,
      });
    }
  }, []);

  // 拨动一颗珠子
  const triggerBead = useCallback((direction = 1) => {
    const stepAngle = (Math.PI * 2) / BEAD_COUNT;
    targetRotationRef.current += stepAngle * direction;
    addMerit(1);

    // 找到当前最近的珠子并添加发光效果
    const canvas = canvasRef.current;
    if (canvas) {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const rx = canvas.width * 0.38;
      const ry = canvas.height * 0.28;
      
      // 在底部区域添加粒子
      const particleX = cx + Math.cos(Math.PI / 2) * rx;
      const particleY = cy + Math.sin(Math.PI / 2) * ry;
      addParticles(particleX, particleY, levelInfo.particleColor, 6);
    }
  }, [addMerit, addParticles, levelInfo.particleColor]);

  // 渲染循环
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const rx = W * 0.38;
    const ry = H * 0.28;

    const render = () => {
      ctx.clearRect(0, 0, W, H);

      // 弹簧-阻尼物理更新
      const diff = targetRotationRef.current - rotationRef.current;
      const springForce = diff * SPRING_STIFFNESS;
      rotationRef.current += springForce;
      rotationRef.current *= DAMPING + (1 - DAMPING) * 0.1;

      // 绘制手腕皮肤背景
      const wristGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(rx, ry) * 0.9);
      wristGrad.addColorStop(0, '#D4A882');
      wristGrad.addColorStop(0.6, '#C49070');
      wristGrad.addColorStop(1, '#8B5E3C');
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx * 0.85, ry * 0.85, 0, 0, Math.PI * 2);
      ctx.fillStyle = wristGrad;
      ctx.fill();

      // 绘制手腕纹理（细线）
      ctx.save();
      ctx.globalAlpha = 0.15;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - rx * 0.7, cy + (i - 2) * 6);
        ctx.bezierCurveTo(
          cx - rx * 0.3, cy + (i - 2) * 6 - 3,
          cx + rx * 0.3, cy + (i - 2) * 6 + 3,
          cx + rx * 0.7, cy + (i - 2) * 6
        );
        ctx.strokeStyle = '#8B5E3C';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      ctx.restore();

      // 计算珠子位置（带透视缩放）
      const beadPositions: { x: number; y: number; z: number; angle: number; isMother: boolean; idx: number }[] = [];
      for (let i = 0; i < BEAD_COUNT; i++) {
        const angle = (i / BEAD_COUNT) * Math.PI * 2 + rotationRef.current;
        const x = cx + Math.cos(angle) * rx;
        const y = cy + Math.sin(angle) * ry;
        // 透视缩放：底部珠子更大（近处），顶部珠子更小（远处）
        const normalizedY = (Math.sin(angle) + 1) / 2; // 0=顶部, 1=底部
        const perspScale = 0.82 + normalizedY * 0.18;
        beadPositions.push({ x, y, z: normalizedY, angle, isMother: i === 0, idx: i });
      }

      // 按Z轴排序（远处先画，近处后画）
      beadPositions.sort((a, b) => a.z - b.z);

      // 绘制珠串连线
      ctx.beginPath();
      for (let i = 0; i < beadPositions.length; i++) {
        const pos = beadPositions[i];
        if (i === 0) ctx.moveTo(pos.x, pos.y);
        else ctx.lineTo(pos.x, pos.y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(100, 70, 20, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 绘制珠子
      const beadR = isWatch ? 10 : 14;
      for (const pos of beadPositions) {
        const normalizedY = (Math.sin(pos.angle) + 1) / 2;
        const perspScale = 0.82 + normalizedY * 0.18;
        const r = beadR * perspScale * (pos.isMother ? 1.35 : 1);

        ctx.save();
        ctx.translate(pos.x, pos.y);

        // 珠子阴影
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // 珠子主体渐变
        const beadGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r);
        
        if (pos.isMother) {
          // 母珠 - 金色
          beadGrad.addColorStop(0, '#FFD700');
          beadGrad.addColorStop(0.4, '#C9A84C');
          beadGrad.addColorStop(0.8, '#8B6914');
          beadGrad.addColorStop(1, '#4A3000');
        } else if (beadStyle.id === 'bodhi') {
          beadGrad.addColorStop(0, '#E8D5A3');
          beadGrad.addColorStop(0.4, '#C4A96A');
          beadGrad.addColorStop(0.8, '#8B6914');
          beadGrad.addColorStop(1, '#5A3A00');
        } else if (beadStyle.id === 'lapis') {
          beadGrad.addColorStop(0, '#4A7FD0');
          beadGrad.addColorStop(0.4, '#1A3A6B');
          beadGrad.addColorStop(0.8, '#0D1F3C');
          beadGrad.addColorStop(1, '#050D1A');
        } else {
          beadGrad.addColorStop(0, '#E05050');
          beadGrad.addColorStop(0.4, '#8B1A1A');
          beadGrad.addColorStop(0.8, '#4A0808');
          beadGrad.addColorStop(1, '#1A0000');
        }

        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = beadGrad;
        ctx.fill();

        // 高光
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        const highlightGrad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, 0, -r * 0.35, -r * 0.35, r * 0.6);
        highlightGrad.addColorStop(0, 'rgba(255,255,255,0.5)');
        highlightGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = highlightGrad;
        ctx.fill();

        // 母珠卍字标记
        if (pos.isMother) {
          ctx.fillStyle = '#030308';
          ctx.font = `bold ${r * 0.8}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('卍', 0, 0);
        } else if (beadStyle.id === 'bodhi') {
          // 菩提珠十字纹
          ctx.strokeStyle = 'rgba(100, 60, 0, 0.5)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(-r * 0.4, 0);
          ctx.lineTo(r * 0.4, 0);
          ctx.moveTo(0, -r * 0.4);
          ctx.lineTo(0, r * 0.4);
          ctx.stroke();
        }

        // 母珠发光效果
        if (pos.isMother) {
          ctx.beginPath();
          ctx.arc(0, 0, r * 1.3, 0, Math.PI * 2);
          const glowGrad = ctx.createRadialGradient(0, 0, r, 0, 0, r * 1.3);
          glowGrad.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
          glowGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }

        ctx.restore();
      }

      // 更新和绘制粒子
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.05; // 向上飘
        p.life -= 0.03;

        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [beadStyle.id, isWatch, levelInfo.particleColor]);

  // 触摸/鼠标事件处理
  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    isDraggingRef.current = true;
    const point = 'touches' in e ? e.touches[0] : e;
    lastTouchXRef.current = point.clientX;
    lastTouchYRef.current = point.clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const point = 'touches' in e ? e.touches[0] : e;
    const dx = point.clientX - lastTouchXRef.current;
    lastTouchXRef.current = point.clientX;
    lastTouchYRef.current = point.clientY;

    if (Math.abs(dx) > 3) {
      const direction = dx > 0 ? 1 : -1;
      triggerBead(direction);
    }
  }, [triggerBead]);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  const handleClick = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTimeRef.current < 100) return;
    lastClickTimeRef.current = now;
    triggerBead(1);
  }, [triggerBead]);

  // 键盘支持
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault();
        triggerBead(1);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        triggerBead(-1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [triggerBead]);

  return (
    <div className="relative flex items-center justify-center select-none">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="touch-none cursor-pointer"
        style={{ borderRadius: '50%' }}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      />
      {/* 点击提示 */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
        <span className="text-xs opacity-40 font-serif-sc" style={{ color: '#C9A84C' }}>
          滑动或点击拨珠
        </span>
      </div>
    </div>
  );
}
