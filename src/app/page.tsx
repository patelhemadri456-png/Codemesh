"use client";

import { useState, useEffect } from "react";
import FramerNavbar from "@/components/FramerNavbar";
import FramerExactHero from "@/components/FramerExactHero";
import LogoMarquee from "@/components/LogoMarquee";
import FramerDesignScreens from "@/components/FramerDesignScreens";
import FramerBentoGrid from "@/components/FramerBentoGrid";
import StorytellingSectionAST from "@/components/StorytellingSectionAST";
import StorytellingSectionRAG from "@/components/StorytellingSectionRAG";
import StorytellingSectionMicroVM from "@/components/StorytellingSectionMicroVM";
import InteractiveStatsBar from "@/components/InteractiveStatsBar";
import ScrollComparisonTable from "@/components/ScrollComparisonTable";
import FramerTestimonialWall from "@/components/FramerTestimonialWall";
import FullBleedFinalCTA from "@/components/FullBleedFinalCTA";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen bg-[#000000] text-white font-body selection:bg-white/20 selection:text-white relative overflow-x-hidden monochrome-mesh-bg noise-overlay">
      
      {/* Framer-Style Floating Island Pill Nav (Pure Black & White) */}
      <FramerNavbar
        onOpenBrief={() => setShowBriefModal(true)}
        onOpenSales={() => setShowSalesModal(true)}
      />

      {/* Framer-Style AI Prompt/Studio Canvas Hero with 3D WebGL Effects */}
      <FramerExactHero
        onOpenDemo={() => setShowDemoModal(true)}
        onOpenBrief={() => setShowBriefModal(true)}
      />

      {/* Cloud Partner Logo Marquee Strip */}
      <LogoMarquee />

      {/* Exact Framer Interactive Feature Screens */}
      <FramerDesignScreens />

      {/* Framer-Style Interactive Bento Feature Grid */}
      <FramerBentoGrid />

      {/* Feature Story 01: Sub-10ms OT Synchronization */}
      <StorytellingSectionAST />

      {/* Feature Story 02: pgvector RAG Repository Memory */}
      <StorytellingSectionRAG />

      {/* Feature Story 03: Ephemeral MicroVM Isolated Runtimes */}
      <StorytellingSectionMicroVM />

      {/* Interactive 3D Tilt Stats Section */}
      <InteractiveStatsBar />

      {/* Architecture Comparison Table */}
      <ScrollComparisonTable />

      {/* Framer-Style Wall of Love Testimonial Bento */}
      <FramerTestimonialWall />

      {/* Full-Bleed Final CTA with Returning 3D Signature Motif */}
      <FullBleedFinalCTA
        onOpenSales={() => setShowSalesModal(true)}
        onOpenBrief={() => setShowBriefModal(true)}
      />

      {/* Developer Footer */}
      <Footer />

      {/* Interactive Modals */}
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
