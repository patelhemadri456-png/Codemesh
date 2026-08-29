import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeMesh: AI-powered collaborative cloud IDE",
  description:
    "Go from idea to live production runtime with an AI agent that codes and executes in the cloud. Real-time OT synchronization, pgvector RAG memory, and instant MicroVMs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..700;1,400..700&family=Geist:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#050508] text-[#ededed] font-body antialiased min-h-screen selection:bg-[#571bc1]/40 selection:text-[#f4f2f0]">
        {children}
      </body>
    </html>
  );
}
