import type { Metadata } from "next";
import localFont from "next/font/local";
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
  title: "M2 Inteligência Tributária",
  description:
    "Escritório especializado em recuperação de crédito para empresas de contabilidade, com atuação estratégica, jurídica e operacional.",
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
      </body>
    </html>
  );
}
