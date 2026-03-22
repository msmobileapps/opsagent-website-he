import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { ToastContainer } from "@/components/toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "OpsAgent — Operations Dashboard",
  description: "Automated operations platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} font-sans antialiased bg-[#0a0a14] text-gray-200`}>
        <Sidebar />
        <main className="lg:ml-60 min-h-screen pt-14 lg:pt-0">
          <div className="max-w-7xl mx-auto p-6">
            {children}
          </div>
        </main>
        <ToastContainer />
      </body>
    </html>
  );
}
