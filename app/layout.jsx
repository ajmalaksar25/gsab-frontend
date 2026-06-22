import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://gsab.ajmalaksar.com"),
  title: "GSAB — Google Sheets as a Backend",
  description:
    "A database-like interface for Google Sheets. Schemas, validation, field encryption, async CRUD and a friction-free CLI. pip install gsab.",
  keywords: ["google sheets", "database", "backend", "python", "gsab", "cli"],
  authors: [{ name: "Ajmal Aksar", url: "https://ajmalaksar.com" }],
  openGraph: {
    title: "GSAB — Google Sheets as a Backend",
    description:
      "Turn Google Sheets into a real backend. Schemas, encryption, async CRUD and a friction-free CLI.",
    url: "https://gsab.ajmalaksar.com",
    siteName: "GSAB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GSAB — Google Sheets as a Backend",
    description:
      "Turn Google Sheets into a real backend. Schemas, encryption, async CRUD and a friction-free CLI.",
  },
};

export const viewport = {
  themeColor: "#FBF9F4",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
