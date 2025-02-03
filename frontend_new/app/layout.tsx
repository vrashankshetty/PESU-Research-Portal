import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth";
import Link from "next/link";

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
  title: "PESU NAAC Portal",
  description:
    "PES University's portal to allow faculty to update and analyze their academic achievements",
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
            <footer className="bg-sky-800 text-white py-4 flex w-full px-4 text-sm lg:text-base">
              <div className="container mx-auto">
                © {new Date().getFullYear()} Research Center. All rights
                reserved.
              </div>
              <Link
                href="/contact"
                className="justify-end text-center hover:underline"
              >
                Contact Us
              </Link>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
