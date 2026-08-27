"use client";

import Link from "next/link";
import { useState } from "react";
import TechnicalBriefModal from "./TechnicalBriefModal";
import ContactSalesModal from "./ContactSalesModal";

export default function Footer() {
  const [showBriefModal, setShowBriefModal] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false);

  return (
    <>
      <footer className="bg-[#0e0e0e] border-t border-[#2d2d2d] w-full pt-12 pb-8 px-6 md:px-12 text-[#8c909f] font-body text-xs relative z-40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-[#2d2d2d]">
          {/* Col 1: Brand & Status */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="font-headline text-base font-bold text-[#adc6ff] flex items-center gap-2 tracking-tight"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                widgets
              </span>
              CodeMesh
            </Link>
            <p className="text-xs text-[#c2c6d6] max-w-sm leading-relaxed">
              High-performance collaborative coding workspace. Real-time AST conflict resolution, pgvector RAG memory, and sub-3ms in-browser runtime.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#181818] border border-[#2d2d2d] font-code text-[11px] text-[#adc6ff]">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span>v2.4.1-stable • All Systems Operational</span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div className="space-y-3">
            <div className="font-code text-xs font-semibold text-[#e5e2e1] uppercase tracking-wider">
              Product
            </div>
            <ul className="space-y-2 font-code text-[11px]">
              <li>
                <Link href="/workspace/demo" className="hover:text-[#adc6ff] transition-colors">
                  Cloud IDE Sandbox
                </Link>
              </li>
              <li>
                <Link href="/workspaces" className="hover:text-[#adc6ff] transition-colors">
                  Workspaces Hub
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setShowBriefModal(true)}
                  className="hover:text-[#adc6ff] transition-colors text-left"
                >
                  pgvector RAG AI
                </button>
              </li>
              <li>
                <Link href="/workspaces" className="hover:text-[#adc6ff] transition-colors">
                  Project Templates
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture & Docs */}
          <div className="space-y-3">
            <div className="font-code text-xs font-semibold text-[#e5e2e1] uppercase tracking-wider">
              Architecture
            </div>
            <ul className="space-y-2 font-code text-[11px]">
              <li>
                <button
                  onClick={() => setShowBriefModal(true)}
                  className="hover:text-[#adc6ff] transition-colors text-left"
                >
                  Technical Brief
                </button>
              </li>
              <li>
                <a href="#velocity" className="hover:text-[#adc6ff] transition-colors">
                  AST Synchronization
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#adc6ff] transition-colors">
                  Distributed Workers
                </a>
              </li>
              <li>
                <button
                  onClick={() => setShowSalesModal(true)}
                  className="hover:text-[#adc6ff] transition-colors text-left"
                >
                  Enterprise VPC
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Company & Community */}
          <div className="space-y-3">
            <div className="font-code text-xs font-semibold text-[#e5e2e1] uppercase tracking-wider">
              Connect
            </div>
            <ul className="space-y-2 font-code text-[11px]">
              <li>
                <button
                  onClick={() => setShowSalesModal(true)}
                  className="hover:text-[#adc6ff] transition-colors text-left"
                >
                  Contact Sales
                </button>
              </li>
              <li>
                <Link href="/auth" className="hover:text-[#adc6ff] transition-colors">
                  Developer Portal
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#adc6ff] transition-colors flex items-center gap-1"
                >
                  <span>GitHub</span>
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-code text-[#8c909f]">
          <div>&copy; 2026 CodeMesh Industrial Digital. Built for speed.</div>
          <div className="flex gap-5">
            <button onClick={() => setShowBriefModal(true)} className="hover:text-[#adc6ff] transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => setShowBriefModal(true)} className="hover:text-[#adc6ff] transition-colors">
              Terms of Service
            </button>
            <button onClick={() => setShowSalesModal(true)} className="hover:text-[#adc6ff] transition-colors">
              Security SLA
            </button>
          </div>
        </div>
      </footer>

      {showBriefModal && <TechnicalBriefModal onClose={() => setShowBriefModal(false)} />}
      {showSalesModal && <ContactSalesModal onClose={() => setShowSalesModal(false)} />}
    </>
  );
}
