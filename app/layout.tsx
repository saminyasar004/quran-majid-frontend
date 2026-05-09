import { Metadata } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { AudioPlayerBar } from "@/components/quran/AudioPlayerBar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const amiri = Amiri({ weight: ["400", "700"], subsets: ["arabic"], variable: "--font-amiri" });

export const metadata: Metadata = {
  title: "Quran Majid",
  description: "A comprehensive Quran application for reading and listening.",
  authors: [{ name: "Quran Majid" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Quran Majid",
    description: "A comprehensive Quran application for reading and listening.",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@nurul_ayah",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${amiri.variable}`}>
      <body className={inter.className}>
        <Providers>
          {children}
          <AudioPlayerBar />
        </Providers>
      </body>
    </html>
  );
}
