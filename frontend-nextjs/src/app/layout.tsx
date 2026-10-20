import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QRDijital - Modern Restoran & Kafe Menü Platformu',
  description: 'Kafe ve restoranlar için yeni nesil, mobil uyumlu, çoklu temalı dijital QR menü SaaS platformu.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@500;600;700&family=Poppins:wght@400;500;600;700&family=Cormorant+Garamond:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-slate-50 text-slate-800">{children}</body>
    </html>
  );
}
