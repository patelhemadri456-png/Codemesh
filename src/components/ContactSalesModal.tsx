"use client";

import { useState } from "react";
import confetti from "canvas-confetti";

interface ContactSalesModalProps {
  onClose: () => void;
}

export default function ContactSalesModal({ onClose }: ContactSalesModalProps) {
  const [teamSize, setTeamSize] = useState("10-50 engineers");
  const [workEmail, setWorkEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0e0e0e]/85 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-[#1c1b1b] border border-[#424754] rounded-lg w-full max-w-md shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Top accent */}
        <div className="border-t-2 border-[#adc6ff] absolute top-0 left-0 right-0 pointer-events-none" />

        {/* Header */}
        <div className="p-4 border-b border-[#2d2d2d] flex justify-between items-center bg-[#201f1f]">
          <h2 className="font-headline text-base font-bold text-[#e5e2e1] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#adc6ff] text-[20px]">
              handshake
            </span>
            Contact Enterprise Engineering
          </h2>
          <button
            className="text-[#8c909f] hover:text-[#e5e2e1] transition-colors p-1"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-green-400">
              check_circle
            </span>
            <h3 className="font-headline text-base font-bold text-[#e5e2e1]">
              Inquiry Received
            </h3>
            <p className="text-xs text-[#c2c6d6]">
              Our engineering architecture team will reach out to{" "}
              <span className="text-[#adc6ff] font-code">{workEmail}</span> within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block font-code text-xs text-[#c2c6d6] mb-1.5 uppercase tracking-wider">
                Work Email
              </label>
              <input
                type="email"
                required
                placeholder="tech-lead@company.com"
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                className="w-full bg-[#121212] border border-[#424754] text-[#e5e2e1] font-code text-xs p-2.5 rounded focus:border-[#adc6ff] focus:outline-none transition-colors placeholder:text-[#8c909f]"
              />
            </div>

            <div>
              <label className="block font-code text-xs text-[#c2c6d6] mb-1.5 uppercase tracking-wider">
                Team Size
              </label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full bg-[#121212] border border-[#424754] text-[#e5e2e1] font-code text-xs p-2.5 rounded focus:border-[#adc6ff] focus:outline-none transition-colors"
              >
                <option value="1-10 engineers">1 - 10 engineers</option>
                <option value="10-50 engineers">10 - 50 engineers</option>
                <option value="50-250 engineers">50 - 250 engineers</option>
                <option value="250+ enterprise">250+ enterprise org</option>
              </select>
            </div>

            <div>
              <label className="block font-code text-xs text-[#c2c6d6] mb-1.5 uppercase tracking-wider">
                Use Case / Infrastructure Requirements
              </label>
              <textarea
                rows={2}
                placeholder="e.g., self-hosted pgvector RAG, custom VPC runners, SSO..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#121212] border border-[#424754] text-[#e5e2e1] font-code text-xs p-2.5 rounded focus:border-[#adc6ff] focus:outline-none transition-colors resize-none placeholder:text-[#8c909f]"
              />
            </div>

            <div className="pt-2 border-t border-[#2d2d2d] flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-[#c2c6d6] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#adc6ff] text-[#002e6a] font-code text-xs font-bold rounded hover:bg-[#d8e2ff] transition-colors flex items-center gap-1"
              >
                <span>Submit Inquiry</span>
                <span className="material-symbols-outlined text-[15px]">send</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
