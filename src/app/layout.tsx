import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeMesh",
  description: "Build together. Code in sync.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
