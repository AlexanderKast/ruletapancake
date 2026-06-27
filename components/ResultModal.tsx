'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { SpinResult } from '@/types';

interface Props {
  result: SpinResult | null;
  onClose: () => void;
}

export default function ResultModal({ result, onClose }: Props) {
  return (
    <AnimatePresence>
      {result && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
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
              background: 'linear-gradient(135deg, #1a1a1a 0%, #0D0D0D 100%)',
              border: `2px solid ${result.color}`,
              boxShadow: `0 0 40px ${result.color}66, 0 0 80px ${result.color}33`,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="h-2" style={{ background: result.color }} />

            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                className="text-8xl mb-4"
              >
                {result.emoji}
              </motion.div>

              {result.is_winner ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-3 text-black"
                  style={{ background: result.color }}
                >
                  🎉 ¡GANASTE!
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-3 bg-white/10 text-white/60"
                >
                  ¡SIGUE INTENTANDO!
                </motion.div>
              )}

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-black text-white mb-3 leading-tight"
              >
                {result.prize_name}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/60 text-sm mb-6 leading-relaxed"
              >
                {result.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                {result.is_winner && (
                  <a
                    href="https://wa.me/573008520037?text=COMENZAR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 rounded-2xl font-black text-black text-lg transition-transform hover:scale-105 active:scale-95"
                    style={{ background: result.color }}
                  >
                    🎁 Reclamar Premio
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="block w-full py-3 rounded-2xl font-bold text-white/70 text-sm bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {result.is_winner ? 'Volver a girar' : '🔄 Intentar de nuevo'}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
