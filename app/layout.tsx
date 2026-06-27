import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Ruleta FIRE — Botcake x Hotmart FIRE Festival',
  description: 'Gira y gana premios exclusivos en el Hotmart FIRE Festival 2026',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} font-sans bg-[#0D0D0D] text-white overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
