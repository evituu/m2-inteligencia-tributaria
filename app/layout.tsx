import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

const montserrat = localFont({
  src: [
    {
      path: "../public/fonte/fonte_montserrat_static/Montserrat-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonte/fonte_montserrat_static/Montserrat-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonte/fonte_montserrat_static/Montserrat-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonte/fonte_montserrat_static/Montserrat-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonte/fonte_montserrat_static/Montserrat-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonte/fonte_montserrat_static/Montserrat-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonte/fonte_montserrat_static/Montserrat-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonte/fonte_montserrat_static/Montserrat-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://m2inteligenciatributaria.com.br",
  ),
  title: {
    default: "M2 Inteligência Tributária — Recuperação de Créditos Tributários",
    template: "%s | M2 Inteligência Tributária",
  },
  description:
    "Especialistas em recuperação de créditos tributários para empresas de todos os portes. Honorários apenas sobre o que for recuperado. Análise inicial gratuita.",
  openGraph: {
    siteName: "M2 Inteligência Tributária",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/imagens/office/fachada_m2.webp",
        width: 1200,
        height: 630,
        alt: "M2 Inteligência Tributária",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/imagens/office/fachada_m2.webp"],
  },
  icons: {
    icon: "/imagens/logo/LOGO_M2_CLEAN.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-sans antialiased"
        suppressHydrationWarning
      >
        <svg
          width="0"
          height="0"
          aria-hidden="true"
          focusable="false"
          style={{ position: "absolute" }}
        >
          <defs>
            <linearGradient
              id="gold-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#d9ad55" />
              <stop offset="42%" stopColor="#f6de95" />
              <stop offset="70%" stopColor="#e8c676" />
              <stop offset="100%" stopColor="#d7aa52" />
            </linearGradient>
          </defs>
        </svg>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
