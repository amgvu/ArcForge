import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientProvider from '@/components/ClientProvider'
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PROJECT ARCS",
  description: "A tool for managing nicknames",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-full bg-neutral-950`}
      >
        <ClientProvider>]
        <Navbar />
        {children}
        </ClientProvider>
      </body>
    </html>
  );
}
