'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { SpinResult } from '@/types';

interface Props {
  result: SpinResult | null;
  onClose: () => void;
  participantName: string;
}

export default function ResultModal({ result, onClose, participantName }: Props) {
  const firstName = participantName.split(' ')[0] || '';

  return (
    <AnimatePresence>
      {result && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
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
                <>
                  <span
                    className="inline-block px-4 py-1 rounded-full text-xs font-black mb-2 text-black"
                    style={{ background: result.color }}
                  >
                    🎉 ¡GANASTE!
                  </span>
                  {firstName && (
                    <p className="text-white/70 text-sm mb-2">
                      ¡Felicitaciones,{' '}
                      <span className="text-white font-black">{firstName}</span>!
                    </p>
                  )}
                </>
              ) : (
                <span className="inline-block px-4 py-1 rounded-full text-xs font-black mb-3 bg-white/10 text-white/60">
                  ¡SIGUE INTENTANDO!
                </span>
              )}

              <h2 className="text-xl font-black text-white mb-2 leading-tight">
                {result.prize_name}
              </h2>
              <p className="text-white/50 text-sm mb-4 leading-relaxed">
                {result.description}
              </p>

              {result.is_winner && (
                <p className="text-white/40 text-xs mb-4 px-2 leading-relaxed">
                  📲 Tus datos ya están registrados. El equipo de Pancake te contactará pronto por WhatsApp.
                </p>
              )}

              <button
                onClick={onClose}
                className="w-full py-4 rounded-2xl font-black text-white text-base transition-all hover:scale-105 active:scale-95"
                style={{
                  background: result.is_winner
                    ? `linear-gradient(135deg, ${result.color}cc, ${result.color})`
                    : 'linear-gradient(135deg, #1565C0, #2196F3)',
                }}
              >
                🎰 Volver a girar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
