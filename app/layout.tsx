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
  title: "Torio Client - external ghost client for Minecraft Bedrock",
  description:
    "38 modules, dual GUI modes, a built-in version switcher and configs that stick. External ghost client for Minecraft Bedrock, v26.20 through v26.45 on Windows.",
  applicationName: "Torio Client",
  icons: {
    icon: `${basePath}/images/icon.png`,
    shortcut: `${basePath}/favicon.ico`,
  },
  openGraph: {
    title: "Torio Client",
    description:
      "External ghost client for Minecraft Bedrock. 38 modules, dual GUI, v26.20 - v26.45.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0a1a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${poetsenOne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
