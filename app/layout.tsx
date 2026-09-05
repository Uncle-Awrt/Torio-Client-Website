import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poetsenOne = localFont({
  src: "../public/fonts/PoetsenOne-Regular.ttf",
  variable: "--font-poetsen-one",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TorioGhost Client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poetsenOne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

