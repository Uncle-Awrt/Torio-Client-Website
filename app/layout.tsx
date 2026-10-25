import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poetsenOne = localFont({
  src: "../public/fonts/PoetsenOne-Regular.ttf",
  variable: "--font-poetsen-one",
  display: "swap",
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL("https://torioghost.net"),
  title: "TorioGhost External - external ghost client for Minecraft Bedrock",
  description:
    "70+ modules, dual GUI modes, a built-in version switcher and configs that stick. External ghost client for Minecraft Bedrock, versions 26.30 through 26.52 on Windows.",
  applicationName: "TorioGhost External",
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico`, sizes: "any" },
      { url: `${basePath}/images/icon.png`, type: "image/png", sizes: "256x256" },
    ],
    shortcut: `${basePath}/favicon.ico`,
    apple: [
      { url: `${basePath}/apple-touch-icon.png`, sizes: "256x256", type: "image/png" },
    ],
  },
  openGraph: {
    title: "TorioGhost External",
    description:
      "External ghost client for Minecraft Bedrock. 70+ modules, dual GUI, 26.30 - 26.52.",
    url: "https://torioghost.net",
    siteName: "TorioGhost External",
    images: [
      {
        url: `${basePath}/images/icon.png`,
        width: 256,
        height: 256,
        alt: "Torio Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "TorioGhost External",
    description:
      "External ghost client for Minecraft Bedrock. 70+ modules, dual GUI, 26.30 - 26.52.",
    images: [`${basePath}/images/icon.png`],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${poetsenOne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
