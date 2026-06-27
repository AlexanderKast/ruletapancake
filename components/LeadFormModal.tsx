'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  visible: boolean;
  prediction: { colombia: number; portugal: number };
  onSuccess: (nombre: string) => void;
  onClose: () => void;
}

const INPUT_STYLE = {
  background: '#1e2535',
  color: '#ffffff',
  border: '1px solid rgba(255,255,255,0.2)',
};

export default function LeadFormModal({ visible, prediction, onSuccess, onClose }: Props) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !whatsapp.trim()) {
      setError('Completa todos los campos para participar.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          email,
          whatsapp,
          prize_name: 'Participante',
          prediction_colombia: prediction.colombia,
          prediction_portugal: prediction.portugal,
        }),
      });
      const savedName = nombre.trim();
      setNombre('');
      setEmail('');
      setWhatsapp('');
      onSuccess(savedName);
    } catch {
      setError('Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="w-full max-w-sm rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #111827 0%, #0D0D0D 100%)',
              border: '2px solid #1E88E5',
              boxShadow: '0 0 50px rgba(30,136,229,0.4)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #1565C0, #2196F3)' }} />
            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-5">
                <div className="text-4xl mb-2">📋</div>
                <h2 className="text-xl font-black text-white">¡Ya casi!</h2>
                <div
                  className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold"
                  style={{
                    background: 'rgba(30,136,229,0.15)',
                    border: '1px solid rgba(30,136,229,0.3)',
                    color: '#90CAF9',
                  }}
                >
                  <span>🇨🇴 {prediction.colombia}</span>
                  <span className="text-white/40">—</span>
                  <span>{prediction.portugal} 🇵🇹</span>
                </div>
                <p className="text-white/40 text-xs mt-2">
                  Ingresa tus datos para confirmar tu participación
                </p>
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
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                    style={INPUT_STYLE}
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
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                    style={INPUT_STYLE}
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
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                    style={INPUT_STYLE}
                    autoComplete="tel"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-xs text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-black text-white text-base transition-all hover:scale-105 active:scale-95 disabled:opacity-60 mt-1"
                  style={{ background: 'linear-gradient(135deg, #1565C0, #2196F3)' }}
                >
                  {loading ? 'Guardando...' : '🎰 ¡IR A LA RULETA!'}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 text-white/30 text-xs hover:text-white/50 transition-colors"
                >
                  ← Volver al pronóstico
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
