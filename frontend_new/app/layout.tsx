import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth";

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
  title: "PESU Research Portal",
  description:
    "A portal to allow faculty to update and analyze their publications and patents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
        <div
          className="min-h-screen flex flex-col"
          style={{
            backgroundImage: "url(/bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Navbar />
          <main className="flex-grow md:mx-auto px-4 py-8">{children}</main>
          <Toaster />
          <footer className="bg-sky-800 text-white py-4">
            <div className="container mx-auto px-4 text-center">
              © {new Date().getFullYear()} Research Center. All rights reserved.
            </div>
          </footer>
        </div>
        </AuthProvider>
      </body>
    </html>
  );
}
