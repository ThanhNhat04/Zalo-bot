import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Quản lý kho hàng",
  description: "Quản lý kho hàng với Zalo Bot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
       <body className={`${geistSans.variable} ${geistMono.variable}`}>
      {/* <body className="bg-black-50"> */}
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 w-full">
            <div className="md:pl-64 pb-16 md:pb-0 min-h-screen">
              <div >
                 {children}
              </div>
            </div>
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
