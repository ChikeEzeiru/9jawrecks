import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "9jaWrecks — Discover Nigeria's Underwater Wonders",
  description:
    "Explore Nigeria's hidden shipwrecks, plane wrecks, and underwater sites. The definitive guide to wreck diving in Nigerian waters.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} font-raleway antialiased`}>
        {children}
      </body>
    </html>
  );
}
