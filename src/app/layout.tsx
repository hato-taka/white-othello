import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "白だけオセロ",
  description: "白しか使えないオセロ⚪️",
  openGraph: {
    title: "白だけオセロ",
    description: "白しか使えないオセロ⚪️",
    url: "https://white-othello-uo94.vercel.app/", // サイトのURLを指定
    images: [
      {
        url: "https://white-othello-uo94.vercel.app/ogp-image.png", // OGP画像のURLを指定
        width: 1200, // 推奨サイズ: 1200x630
        height: 630,
        alt: "白だけオセロのOGP画像",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
