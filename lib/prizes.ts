// SERVER ONLY — never import from client components
export const PRIZES = [
  {
    name: "85% OFF primer mes + Asesoría",
    emoji: "🔥",
    color: "#FA4616",
    prob: 2,
    isWinner: true,
    description: "El deal del año. 85% de descuento en tu primer mes de LiveCake + asesoría personalizada con el equipo.",
  },
  {
    name: "Configuración LiveCake",
    emoji: "🎬",
    color: "#FF6B35",
    prob: 2,
    isWinner: true,
    description: "Te ayudamos a configurar tu cuenta LiveCake desde cero. ¡Listo para grabar tu primer curso!",
  },
  {
    name: "Certificación Gratuita",
    emoji: "🏆",
    color: "#25E366",
    prob: 3,
    isWinner: true,
    description: "Obtén tu certificación oficial y demuestra que estás a otro nivel en la industria del contenido.",
  },
  {
    name: "Hora de asesoría",
    emoji: "💡",
    color: "#FFD700",
    prob: 5,
    isWinner: true,
    description: "Una hora 1:1 con el equipo de Botcake. Estrategia, monetización, crecimiento — lo que necesites.",
  },
  {
    name: "Libro digital Mauricio Cuevas",
    emoji: "📚",
    color: "#9B59B6",
    prob: 18,
    isWinner: true,
    description: "No hay excusas — El libro que ha transformado miles de emprendedores en LATAM.",
  },
  {
    name: "Sigue intentando",
    emoji: "💪",
    color: "#444444",
    prob: 70,
    isWinner: false,
    description: "¡No te rindas! Cada giro es una nueva oportunidad. El éxito está a un giro de distancia.",
  },
] as const;

export type Prize = (typeof PRIZES)[number];

export function selectPrize(): (typeof PRIZES)[number] {
  const totalWeight = PRIZES.reduce((sum, p) => sum + p.prob, 0);
  let random = Math.random() * totalWeight;
  for (const prize of PRIZES) {
    random -= prize.prob;
    if (random <= 0) return prize;
  }
  return PRIZES[PRIZES.length - 1];
}
