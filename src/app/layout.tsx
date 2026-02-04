import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "ProtocolOS - Acompanhamento de Treino e Dieta",
    template: "%s | ProtocolOS",
  },
  description: "Acompanhe seu treino e dieta. Upload de PDF, check-in diário, gráficos de evolução e muito mais.",
  keywords: ["treino", "dieta", "fitness", "musculação", "nutrição", "acompanhamento", "protocolo"],
  authors: [{ name: "ProtocolOS" }],
  creator: "ProtocolOS",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://protocolos-two.vercel.app"),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    title: "ProtocolOS - Seu Protocolo de Treino e Dieta",
    description: "Acompanhe seu protocolo de treino e dieta com facilidade. Upload de PDF, check-in diário e evolução.",
    siteName: "ProtocolOS",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProtocolOS - Acompanhamento de Treino e Dieta",
    description: "Acompanhe seu protocolo de treino e dieta com facilidade.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
