'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SpinResult } from '@/types';

interface Props {
  result: SpinResult | null;
  onClose: () => void;
}

type Step = 'prize' | 'form' | 'success';

export default function ResultModal({ result, onClose }: Props) {
  const [step, setStep] = useState<Step>('prize');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleOpen() {
    setStep('prize');
    setNombre('');
    setEmail('');
    setWhatsapp('');
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !whatsapp.trim()) {
      setError('Completa todos los campos para reclamar tu premio.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, whatsapp, prize_name: result?.prize_name }),
      });
      setStep('success');
    } catch {
      setError('Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence onExitComplete={handleOpen}>
      {result && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={step === 'success' ? onClose : undefined}
        >
          <motion.div
            key="modal-content"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="relative w-full max-w-sm rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #111827 0%, #0D0D0D 100%)',
              border: `2px solid ${result.color}`,
              boxShadow: `0 0 40px ${result.color}66, 0 0 80px ${result.color}22`,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="h-1.5" style={{ background: result.color }} />

            {/* ── PASO 1: Premio ── */}
            {step === 'prize' && (
              <div className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: 'spring', damping: 10 }}
                  className="text-7xl mb-3"
                >
                  {result.emoji}
                </motion.div>

                {result.is_winner ? (
                  <span className="inline-block px-4 py-1 rounded-full text-xs font-black mb-3 text-black"
                    style={{ background: result.color }}>
                    🎉 ¡GANASTE!
                  </span>
                ) : (
                  <span className="inline-block px-4 py-1 rounded-full text-xs font-black mb-3 bg-white/10 text-white/60">
                    ¡SIGUE INTENTANDO!
                  </span>
                )}

                <h2 className="text-xl font-black text-white mb-2 leading-tight">
                  {result.prize_name}
                </h2>
                <p className="text-white/50 text-sm mb-5 leading-relaxed">
                  {result.description}
                </p>

                <div className="space-y-2">
                  {result.is_winner ? (
                    <button
                      onClick={() => setStep('form')}
                      className="w-full py-4 rounded-2xl font-black text-white text-base transition-transform hover:scale-105 active:scale-95"
                      style={{ background: `linear-gradient(135deg, #1565C0, #2196F3)` }}
                    >
                      🎁 Reclamar mi premio
                    </button>
                  ) : null}
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-2xl font-bold text-white/60 text-sm bg-white/8 hover:bg-white/15 transition-colors"
                  >
                    {result.is_winner ? 'Volver a girar' : '🔄 Intentar de nuevo'}
                  </button>
                </div>
              </div>
            )}

            {/* ── PASO 2: Formulario ── */}
            {step === 'form' && (
              <div className="p-6">
                <div className="text-center mb-5">
                  <p className="text-white/50 text-xs mb-1">Registra tus datos para reclamar</p>
                  <h2 className="text-lg font-black text-white leading-tight">
                    {result.emoji} {result.prize_name}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-white/60 text-xs font-semibold mb-1 ml-1">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={e => setNombre(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#1E88E5] transition-colors"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs font-semibold mb-1 ml-1">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#1E88E5] transition-colors"
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs font-semibold mb-1 ml-1">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      placeholder="+57 300 000 0000"
                      className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#1E88E5] transition-colors"
                      autoComplete="tel"
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-xs text-center">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl font-black text-white text-base transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                    style={{ background: 'linear-gradient(135deg, #1565C0, #2196F3)' }}
                  >
                    {loading ? 'Guardando...' : '✅ Confirmar y reclamar'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('prize')}
                    className="w-full py-2 text-white/40 text-xs hover:text-white/60 transition-colors"
                  >
                    ← Volver
                  </button>
                </form>
              </div>
            )}

            {/* ── PASO 3: Éxito ── */}
            {step === 'success' && (
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 8 }}
                  className="text-7xl mb-4"
                >
                  🎊
                </motion.div>
                <h2 className="text-2xl font-black text-white mb-2">¡Listo, {nombre.split(' ')[0]}!</h2>
                <p className="text-white/60 text-sm mb-2 leading-relaxed">
                  Tu premio <strong className="text-white">{result.prize_name}</strong> ha sido registrado.
                </p>
                <p className="text-white/40 text-xs mb-6">
                  El equipo de Pancake te contactará pronto por WhatsApp o correo.
                </p>
                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl font-black text-white text-base"
                  style={{ background: 'linear-gradient(135deg, #1565C0, #2196F3)' }}
                >
                  🎰 Volver a girar
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
