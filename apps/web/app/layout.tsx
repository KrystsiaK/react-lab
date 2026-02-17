import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diary Lab",
  description: "Fullstack diary app with microfrontend",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
