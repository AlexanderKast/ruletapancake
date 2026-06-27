'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Props {
  onParticipate: (prediction: { colombia: number; portugal: number }) => void;
}

function ScorePicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => onChange(Math.min(9, value + 1))}
        className="w-14 h-14 rounded-full font-black text-2xl text-white flex items-center justify-center transition-transform active:scale-90"
        style={{ background: '#1E88E5', boxShadow: '0 0 15px rgba(30,136,229,0.5)' }}
      >
        +
      </button>
      <span
        className="text-white font-black tabular-nums text-center"
        style={{ fontSize: '72px', lineHeight: 1, textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
      >
        {value}
      </span>
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-14 h-14 rounded-full font-black text-2xl text-white flex items-center justify-center transition-transform active:scale-90"
        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)' }}
      >
        −
      </button>
    </div>
  );
}

export default function PredictScreen({ onParticipate }: Props) {
  const [colombia, setColombia] = useState(1);
  const [portugal, setPortugal] = useState(0);

  return (
    <div className="relative h-dvh w-dvw overflow-hidden flex flex-col select-none">
      {/* Background image */}
      <Image
        src="/fondo-partido.jpg"
        alt="Colombia vs Portugal"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Gradient overlay: oscuro arriba y abajo, algo más abierto en el medio */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.90) 100%)',
        }}
      />

      <div className="relative z-10 flex flex-col h-full items-center justify-between px-5 py-8">

        {/* ── TOP: Logo + Título ── */}
        <div className="flex flex-col items-center gap-3 pt-1">
          <Image src="/logo-pancake.png" alt="Pancake" width={145} height={33} className="object-contain" priority />
          <div className="text-center">
            <p className="text-white/50 text-xs font-bold tracking-[0.25em] uppercase mb-1">
              Hotmart FIRE Festival 2026
            </p>
            <h1
              className="font-black uppercase leading-none"
              style={{ fontSize: '2.6rem', color: '#ffffff', letterSpacing: '-0.01em' }}
            >
              Acierta
            </h1>
            <h1
              className="font-black uppercase leading-none"
              style={{
                fontSize: '2.6rem',
                color: '#1E88E5',
                textShadow: '0 0 40px rgba(30,136,229,0.7)',
                letterSpacing: '-0.01em',
              }}
            >
              y Gana ⚽
            </h1>
          </div>
        </div>

        {/* ── MIDDLE: Marcador ── */}
        <div className="w-full max-w-xs">
          <p className="text-white/65 text-center text-sm font-semibold mb-4 tracking-wide">
            ¿Cuál será el marcador final?
          </p>

          {/* Glassmorphism card */}
          <div
            className="rounded-3xl px-5 py-7"
            style={{
              background:
                'linear-gradient(135deg, rgba(13,13,13,0.88) 0%, rgba(6,20,40,0.88) 100%)',
              border: '1px solid rgba(30,136,229,0.4)',
              boxShadow:
                '0 0 60px rgba(30,136,229,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
              backdropFilter: 'blur(28px)',
            }}
          >
            <div className="flex items-center justify-between gap-2">
              {/* Colombia */}
              <div className="flex-1 flex flex-col items-center gap-2">
                <span style={{ fontSize: '3.2rem' }}>🇨🇴</span>
                <span className="text-white font-black text-xs uppercase tracking-widest">Colombia</span>
                <ScorePicker value={colombia} onChange={setColombia} />
              </div>

              {/* VS */}
              <div className="flex flex-col items-center gap-3 px-1">
                <div
                  className="rounded-xl px-3 py-2 text-xs font-black tracking-widest"
                  style={{
                    color: '#90CAF9',
                    background: 'rgba(30,136,229,0.15)',
                    border: '1px solid rgba(30,136,229,0.3)',
                  }}
                >
                  VS
                </div>
                <div className="text-white/20 font-black text-3xl leading-none">—</div>
              </div>

              {/* Portugal */}
              <div className="flex-1 flex flex-col items-center gap-2">
                <span style={{ fontSize: '3.2rem' }}>🇵🇹</span>
                <span className="text-white font-black text-xs uppercase tracking-widest">Portugal</span>
                <ScorePicker value={portugal} onChange={setPortugal} />
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM: CTA ── */}
        <div className="w-full max-w-xs">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onParticipate({ colombia, portugal })}
            className="w-full rounded-2xl font-black text-white py-6"
            style={{
              fontSize: '1.4rem',
              background: 'linear-gradient(135deg, #1565C0 0%, #1E88E5 50%, #2196F3 100%)',
              boxShadow: '0 0 35px rgba(30,136,229,0.55)',
            }}
          >
            ⚽ ¡PARTICIPAR AHORA!
          </motion.button>
          <p className="text-white/35 text-xs text-center mt-3">
            Ingresa tu pronóstico y pasa a girar la ruleta
          </p>
        </div>
      </div>
    </div>
  );
}
