'use client';
import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';

export const WHEEL_SEGMENTS = [
  { name: "85% OFF + Asesoría", emoji: "🔥", color: "#FA4616" },
  { name: "Libro Mauricio",     emoji: "📚", color: "#9B59B6" },
  { name: "Hora asesoría",      emoji: "💡", color: "#FFD700" },
  { name: "Sigue intentando",   emoji: "💪", color: "#444444" },
  { name: "Certificación",      emoji: "🏆", color: "#25E366" },
  { name: "Config. LiveCake",   emoji: "🎬", color: "#FF6B35" },
  { name: "85% OFF + Asesoría", emoji: "🔥", color: "#FA4616" },
  { name: "Libro Mauricio",     emoji: "📚", color: "#9B59B6" },
  { name: "Hora asesoría",      emoji: "💡", color: "#FFD700" },
  { name: "Sigue intentando",   emoji: "💪", color: "#333333" },
  { name: "Certificación",      emoji: "🏆", color: "#25E366" },
  { name: "Config. LiveCake",   emoji: "🎬", color: "#FF6B35" },
];

export interface WheelHandle {
  spinTo: (targetSegment: number, onComplete: () => void) => void;
}

interface Props {
  size: number;
  isSpinning: boolean;
}

const Wheel = forwardRef<WheelHandle, Props>(({ size, isSpinning }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentRotationRef = useRef(0);
  const animationRef = useRef<number>(0);

  const drawWheel = useCallback((rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 4;
    const segmentAngle = (2 * Math.PI) / WHEEL_SEGMENTS.length;

    ctx.clearRect(0, 0, size, size);

    WHEEL_SEGMENTS.forEach((seg, i) => {
      const startAngle = rotation + i * segmentAngle - Math.PI / 2;
      const endAngle = startAngle + segmentAngle;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.strokeStyle = '#0D0D0D';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation + i * segmentAngle - Math.PI / 2 + segmentAngle / 2);
      ctx.textAlign = 'right';

      // Emoji
      ctx.font = `${size * 0.052}px serif`;
      ctx.fillText(seg.emoji, radius - 10, 6);

      // Label — dos líneas si es largo
      ctx.font = `bold ${size * 0.031}px Poppins, sans-serif`;
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,1)';
      ctx.shadowBlur = 5;
      const words = seg.name.split(' ');
      if (seg.name.length <= 12) {
        ctx.fillText(seg.name, radius - size * 0.065, 6);
      } else {
        // Split roughly in half
        const mid = Math.ceil(words.length / 2);
        const line1 = words.slice(0, mid).join(' ');
        const line2 = words.slice(mid).join(' ');
        const lineH = size * 0.033;
        ctx.fillText(line1, radius - size * 0.065, -lineH / 2 + 3);
        ctx.fillText(line2, radius - size * 0.065,  lineH / 2 + 3);
      }
      ctx.restore();
    });

    // Center circle
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.12);
    gradient.addColorStop(0, '#2196F3');
    gradient.addColorStop(1, '#1565C0');
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.12, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = `bold ${size * 0.042}px Poppins, sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;
    ctx.fillText('GIRA', cx, cy - 3);
    ctx.fillText('YA', cx, cy + size * 0.044);

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#1E88E5';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 5, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(33,150,243,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [size]);

  useEffect(() => {
    drawWheel(currentRotationRef.current);
  }, [drawWheel]);

  useImperativeHandle(ref, () => ({
    spinTo: (targetSegment: number, onComplete: () => void) => {
      const segmentAngle = (2 * Math.PI) / WHEEL_SEGMENTS.length;
      // To land on targetSegment: center of that segment should be at top (pointer)
      // center of segment i = rotation + i*segmentAngle + segmentAngle/2 - PI/2 = -PI/2
      // => rotation = -i*segmentAngle - segmentAngle/2
      const targetAngle = -(targetSegment * segmentAngle + segmentAngle / 2);
      const normalizedTarget = ((targetAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const minSpins = 6;
      const totalRotation = minSpins * 2 * Math.PI + normalizedTarget;

      const startRotation = currentRotationRef.current;
      const endRotation = startRotation + totalRotation;
      const duration = 5500 + Math.random() * 800;
      const startTime = performance.now();

      function easeOut(t: number): number {
        return 1 - Math.pow(1 - t, 4);
      }

      function animate(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const easedT = easeOut(t);
        currentRotationRef.current = startRotation + (endRotation - startRotation) * easedT;
        drawWheel(currentRotationRef.current);

        if (t < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          currentRotationRef.current = endRotation % (2 * Math.PI);
          onComplete();
        }
      }

      cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(animate);
    },
  }));

  return (
    <div className="relative flex items-center justify-center">
      {/* Pointer arrow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
        style={{
          filter: 'drop-shadow(0 2px 8px rgba(250,70,22,0.9))',
          marginTop: '-2px',
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '14px solid transparent',
            borderRight: '14px solid transparent',
            borderTop: '32px solid #1E88E5',
          }}
        />
      </div>

      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className={`rounded-full transition-all duration-300 ${isSpinning ? 'wheel-glow-spinning' : 'wheel-glow'}`}
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
});

Wheel.displayName = 'Wheel';
export default Wheel;
