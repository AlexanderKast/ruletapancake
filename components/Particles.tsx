'use client';
import { useEffect, useRef } from 'react';

export default function Particles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles: HTMLDivElement[] = [];
    const colors = ['#FA4616', '#FF6B35', '#FFD700', '#FF4500'];

    function createParticle() {
      if (!container) return;
      const p = document.createElement('div');
      const size = Math.random() * 6 + 2;
      const x = Math.random() * 100;
      const duration = Math.random() * 8 + 6;
      const delay = Math.random() * 4;
      const color = colors[Math.floor(Math.random() * colors.length)];

      p.style.cssText = `
        position: absolute;
        left: ${x}%;
        bottom: -10px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        opacity: 0.7;
        animation: fire-particle ${duration}s ${delay}s linear infinite;
        pointer-events: none;
      `;
      container.appendChild(p);
      particles.push(p);

      if (particles.length > 25) {
        const old = particles.shift();
        old?.remove();
      }
    }

    const interval = setInterval(createParticle, 400);
    return () => {
      clearInterval(interval);
      particles.forEach(p => p.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    />
  );
}
