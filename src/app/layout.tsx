import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "../app/providers/SessionProviderWrapper";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Music Finder",
  description: "Discover and explore your favorite music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="bg-gray-900">
        <SessionProviderWrapper>
          <div className="flex min-h-screen">
            {/* Sidebar - 13% */}
            <Sidebar />

            {/* Main Content - 87% */}
            <main className="flex-1 flex flex-col bg-gray-900">
              {/* Page Content with Footer */}
              <div className="flex-1 overflow-x-hidden" style={{ paddingTop: "100px", paddingRight: "30px", paddingBottom: "30px", paddingLeft: "30px" }}>
                <div className="w-full">
                  {children}
                </div>
              </div>

              {/* Footer - Fixed at bottom */}
              <footer className="border-t border-gray-700  px-6 py-2 flex-shrink-0">
                <p className="text-center text-sm text-gray-400">
                  © 2026 Music Finder. All rights reserved.
                </p>
              </footer>
            </main>
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
