'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Wheel, { WheelHandle } from '@/components/Wheel';
import ResultModal from '@/components/ResultModal';
import type { SpinResult, StatsResult } from '@/types';

const Particles = dynamic(() => import('@/components/Particles'), { ssr: false });
const Confetti = dynamic(() => import('@/components/Confetti'), { ssr: false });
const FomoTicker = dynamic(() => import('@/components/FomoTicker'), { ssr: false });
const CounterBar = dynamic(() => import('@/components/CounterBar'), { ssr: false });

function useSounds() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const playTick = useCallback(() => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // audio not available
    }
  }, [getCtx]);

  const playFanfare = useCallback(() => {
    try {
      const ctx = getCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.18);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.35);
        osc.start(ctx.currentTime + i * 0.18);
        osc.stop(ctx.currentTime + i * 0.18 + 0.35);
      });
    } catch {
      // audio not available
    }
  }, [getCtx]);

  const playTryAgain = useCallback(() => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // audio not available
    }
  }, [getCtx]);

  return { playTick, playFanfare, playTryAgain };
}

export default function Home() {
  const wheelRef = useRef<WheelHandle>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<SpinResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [stats, setStats] = useState<StatsResult>({ spins_today: 0, winners_today: 0 });
  const [wheelSize, setWheelSize] = useState(340);
  const tickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { playTick, playFanfare, playTryAgain } = useSounds();

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  useEffect(() => {
    function updateSize() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxFromWidth = vw * 0.92;
      const maxFromHeight = vh * 0.52;
      setWheelSize(Math.min(maxFromWidth, maxFromHeight, 620));
    }
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleSpin = useCallback(async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);
    setShowConfetti(false);

    const spinStartTime = performance.now();

    // 1. Rueda y sonido arrancan INMEDIATAMENTE
    wheelRef.current?.startFreeSpin();

    function scheduleTick() {
      playTick();
      tickTimerRef.current = setTimeout(scheduleTick, 85);
    }
    scheduleTick();

    try {
      // 2. API call en paralelo mientras la rueda ya gira
      const response = await fetch('/api/spin', { method: 'POST' });
      const data: SpinResult = await response.json();

      // 3. Mínimo 1.8s de giro libre para buena experiencia visual
      const elapsed = performance.now() - spinStartTime;
      const remaining = Math.max(0, 1800 - elapsed);
      await new Promise(r => setTimeout(r, remaining));

      // 4. Detener ticks y aterrizar suavemente en el segmento correcto
      if (tickTimerRef.current) clearTimeout(tickTimerRef.current);

      wheelRef.current?.landAt(data.target_segment, () => {
        setTimeout(() => {
          setResult(data);
          setIsSpinning(false);
          if (data.is_winner) {
            playFanfare();
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 4500);
          } else {
            playTryAgain();
          }
        }, 400);
      });
    } catch {
      if (tickTimerRef.current) clearTimeout(tickTimerRef.current);
      setIsSpinning(false);
    }
  }, [isSpinning, playTick, playFanfare, playTryAgain]);

  const handleCloseModal = useCallback(() => {
    setResult(null);
    setShowConfetti(false);
  }, []);

  return (
    <>
      {/* Landscape warning overlay */}
      <div className="landscape-warning hidden fixed inset-0 bg-[#0D0D0D] z-[100] items-center justify-center flex-col gap-4 text-center p-8">
        <div className="text-6xl">📱</div>
        <p className="text-white font-bold text-xl">Gira el dispositivo</p>
        <p className="text-white/60 text-sm">Esta experiencia está diseñada para modo vertical</p>
      </div>

      <Particles />
      <Confetti active={showConfetti} />

      <main
        className="main-content relative z-10 flex flex-col h-dvh w-dvw overflow-hidden select-none"
        style={{ background: 'radial-gradient(ellipse at top, #061428 0%, #0D0D0D 60%)' }}
      >
        {/* Header */}
        <div className="flex-none pt-3 px-5 pb-1">
          {/* Logo Pancake + Live indicator */}
          <div className="flex items-center justify-between mb-2">
            <Image
              src="/logo-pancake.png"
              alt="Pancake"
              width={160}
              height={36}
              className="object-contain"
              priority
            />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 blink-dot" />
              <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">Live</span>
            </div>
          </div>

          <div className="text-center mt-1">
            <h1 className="text-3xl font-black text-white leading-tight tracking-tight uppercase">
              Gira la Ruleta
            </h1>
            <h1
              className="text-3xl font-black leading-tight tracking-tight uppercase"
              style={{ color: '#1E88E5', textShadow: '0 0 30px #1E88E566' }}
            >
              y Gana Premios
            </h1>
            <p className="text-white/40 text-xs font-semibold mt-1 flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E88E5] inline-block" />
              Hotmart FIRE Festival 2026
            </p>
          </div>
        </div>

        {/* FOMO Ticker */}
        <div className="flex-none">
          <FomoTicker />
        </div>

        {/* Counters */}
        <div className="flex-none py-2 px-5">
          <CounterBar initialSpins={stats.spins_today} initialWinners={stats.winners_today} />
        </div>

        {/* Wheel + Button */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 min-h-0 py-2">
          <div className="relative pt-3">
            <Wheel ref={wheelRef} size={wheelSize} isSpinning={isSpinning} />
          </div>

          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`
              w-full max-w-xs py-5 rounded-2xl font-black text-xl text-white
              transition-all duration-200 relative overflow-hidden
              ${isSpinning ? 'opacity-60 cursor-not-allowed scale-95' : 'pulse-glow hover:scale-105 active:scale-95'}
            `}
            style={{
              background: isSpinning
                ? '#555'
                : 'linear-gradient(135deg, #1565C0 0%, #1E88E5 50%, #2196F3 100%)',
            }}
          >
            {isSpinning ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block">⚙️</span> Girando...
              </span>
            ) : (
              '🎰 ¡GIRA Y GANA!'
            )}
          </button>
        </div>

        {/* Partners banner */}
        <div className="flex-none px-0 pb-2">
          <Image
            src="/partners-banner.jpg"
            alt="Pancake · Meta Business Partner · Google Partner · TikTok Marketing Partner"
            width={1080}
            height={103}
            className="w-full object-contain"
            priority
          />
        </div>

      </main>

      <ResultModal result={result} onClose={handleCloseModal} />
    </>
  );
}
