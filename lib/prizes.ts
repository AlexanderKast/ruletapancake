// SERVER ONLY — never import from client components
// Distribución diseñada para captura de leads: 92% ganadores, 8% "sigue intentando"
// El 85% OFF es el lead magnet principal — mayor probabilidad para máxima conversión
export const PRIZES = [
  {
    name: "85% OFF primer mes + Asesoría",
    emoji: "🔥",
    color: "#FA4616",
    prob: 40,
    isWinner: true,
    description: "El deal del año. 85% de descuento en tu primer mes de LiveCake + asesoría personalizada con el equipo. ¡Escríbenos ahora para reclamarlo!",
  },
  {
    name: "Libro digital Mauricio Cuevas",
    emoji: "📚",
    color: "#9B59B6",
    prob: 27,
    isWinner: true,
    description: "No hay excusas — El libro que ha transformado miles de emprendedores en LATAM. Te lo enviamos directo a tu WhatsApp.",
  },
  {
    name: "Hora de asesoría",
    emoji: "💡",
    color: "#FFD700",
    prob: 13,
    isWinner: true,
    description: "Una hora 1:1 con el equipo de Botcake. Estrategia, monetización, crecimiento — lo que necesites. ¡Agenda tu sesión ahora!",
  },
  {
    name: "Certificación Gratuita",
    emoji: "🏆",
    color: "#25E366",
    prob: 7,
    isWinner: true,
    description: "Obtén tu certificación oficial y demuestra que estás a otro nivel en la industria del contenido.",
  },
  {
    name: "Configuración LiveCake",
    emoji: "🎬",
    color: "#FF6B35",
    prob: 5,
    isWinner: true,
    description: "Te ayudamos a configurar tu cuenta LiveCake desde cero. ¡Listo para grabar tu primer curso!",
  },
  {
    name: "Sigue intentando",
    emoji: "💪",
    color: "#555555",
    prob: 8,
    isWinner: false,
    description: "¡Casi! Vuelve a girar — cada intento te acerca más a tu premio. Más de 9 de cada 10 personas ganan.",
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
