import type { Metadata } from "next";
import { siteMetadata } from "./lib/metadata";
import { Rubik } from "next/font/google";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/navbar";
import PageTransition from "@/app/components/PageTransition";

const rubik = Rubik({
  weight: ["400", "500", "700","800","900"],
  variable: "--font-rubik",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});



export const metadata:Metadata = siteMetadata;  

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${rubik.variable} ${playfair.variable} ${dmSans.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body >
           <Navbar /> 
          <PageTransition /> 
        {children}
      </body>
    </html>
  );
}
