"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero3DCanvas from "@/components/Hero3DCanvas";
import HeroHeadline from "@/components/HeroHeadline";
import LogoMarquee from "@/components/LogoMarquee";
import StorytellingSectionAST from "@/components/StorytellingSectionAST";
import StorytellingSectionRAG from "@/components/StorytellingSectionRAG";
import StorytellingSectionMicroVM from "@/components/StorytellingSectionMicroVM";
import ScrollComparisonTable from "@/components/ScrollComparisonTable";
import InteractiveStatsBar from "@/components/InteractiveStatsBar";
import SocialProofMarquee from "@/components/SocialProofMarquee";
import FullBleedFinalCTA from "@/components/FullBleedFinalCTA";
import TechnicalBriefModal from "@/components/TechnicalBriefModal";
import DemoVideoModal from "@/components/DemoVideoModal";
import ContactSalesModal from "@/components/ContactSalesModal";
import CommandPaletteModal from "@/components/CommandPaletteModal";

export default function Home() {
  const [showBriefModal, setShowBriefModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e5e2e1] font-body selection:bg-[#571bc1]/40 selection:text-[#f4f2f0] relative overflow-x-hidden gradient-mesh-bg noise-overlay">
      
      {/* Navbar */}
      <Navbar variant="landing" />

      {/* Hero Section with 3D Parallax Canvas & Word-by-Word Reveal */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center pt-24 pb-12 overflow-hidden">
        <Hero3DCanvas />
        <HeroHeadline
          onOpenDemo={() => setShowDemoModal(true)}
          onOpenBrief={() => setShowBriefModal(true)}
        />
      </section>

      {/* Cloud Partner Logo Marquee Strip */}
      <LogoMarquee />

      {/* Storytelling Feature 1: Sub-10ms OT Synchronization (Asymmetric Left-Right) */}
      <StorytellingSectionAST />

      {/* Storytelling Feature 2: pgvector RAG Repository Memory (Asymmetric Right-Left) */}
      <StorytellingSectionRAG />

      {/* Storytelling Feature 3: Ephemeral MicroVM Isolated Runtimes (Asymmetric Left-Right) */}
      <StorytellingSectionMicroVM />

      {/* Live Interactive Stats Bar (3D Tilt Cards) */}
      <InteractiveStatsBar />

      {/* Scroll-Animated Architecture Comparison Table */}
      <ScrollComparisonTable />

      {/* Social Proof & Engineer Testimonial Marquee (Railway-Style) */}
      <SocialProofMarquee />

      {/* Full-Bleed Final CTA with Returning 3D Signature Motif */}
      <FullBleedFinalCTA
        onOpenSales={() => setShowSalesModal(true)}
        onOpenBrief={() => setShowBriefModal(true)}
      />

      {/* Minimal Developer Footer */}
      <Footer />

      {/* Interactive Global Modals */}
      {showBriefModal && (
        <TechnicalBriefModal onClose={() => setShowBriefModal(false)} />
      )}
      {showDemoModal && (
        <DemoVideoModal onClose={() => setShowDemoModal(false)} />
      )}
      {showSalesModal && (
        <ContactSalesModal onClose={() => setShowSalesModal(false)} />
      )}
      {showCommandPalette && (
        <CommandPaletteModal onClose={() => setShowCommandPalette(false)} />
      )}
    </div>
  );
}
