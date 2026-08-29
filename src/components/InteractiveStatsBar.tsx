"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  id: string;
  label: string;
  prefix?: string;
  suffix?: string;
  targetValue: number;
  decimals?: number;
  subtext: string;
  badge: string;
  glowColor: string;
}

const statsData: StatItem[] = [
  {
    id: "latency",
    label: "Global Sync P99 Latency",
    prefix: "< ",
    suffix: "ms",
    targetValue: 12,
    subtext: "Real-time OT/CRDT delta propagation across 32 edge clusters",
    badge: "Sub-frame speed",
    glowColor: "#d0bcff",
  },
  {
    id: "nodes",
    label: "Concurrent AST Nodes",
    suffix: "K+",
    targetValue: 100,
    subtext: "Live indexed memory tree per active room with zero lock contention",
    badge: "Massive scale",
    glowColor: "#ffb786",
  },
  {
    id: "spinup",
    label: "MicroVM Spin-Up",
    prefix: "< ",
    suffix: "ms",
    targetValue: 148,
    subtext: "Ephemeral Firecracker container ready to compile & execute code",
    badge: "Instant boot",
    glowColor: "#adc6ff",
  },
  {
    id: "uptime",
    label: "Enterprise SLA Uptime",
    suffix: "%",
    targetValue: 99.99,
    decimals: 2,
    subtext: "Multi-region fallback with automatic peer mesh reconnect",
    badge: "Mission critical",
    glowColor: "#86efac",
  },
];

function StatCard({ stat, count }: { stat: StatItem; count: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setTransformStyle(
      `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    );
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle("perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
      }}
      className={`relative rounded-2xl bg-[#11101b]/90 border border-[#262438] p-6 backdrop-blur-xl transition-all duration-300 overflow-hidden shadow-lg ${
        isHovered
          ? "border-[#524b75] shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(208,188,255,0.15)]"
          : ""
      }`}
    >
      <div
        className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ backgroundColor: stat.glowColor }}
      />

      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-code uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1c1b29] text-[#9c9aa8] border border-[#302e42]">
          {stat.badge}
        </span>
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: stat.glowColor }}
        />
      </div>

      <div className="text-4xl sm:text-5xl font-extrabold text-[#f4f2f0] font-code tracking-tight mb-2">
        <span className="text-[#a5a2b8]">{stat.prefix}</span>
        <span>
          {stat.decimals ? count?.toFixed(stat.decimals) : count || 0}
        </span>
        <span className="text-[#d0bcff] font-semibold">{stat.suffix}</span>
      </div>

      <h3 className="text-sm font-semibold text-[#e5e2e1] mb-1 font-body">
        {stat.label}
      </h3>

      <p className="text-xs text-[#7b788c] font-body leading-relaxed">
        {stat.subtext}
      </p>
    </div>
  );
}

export default function InteractiveStatsBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({
    latency: 0,
    nodes: 0,
    spinup: 0,
    uptime: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();
          const duration = 1500;

          const animateCounts = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            setCounts({
              latency: Math.floor(12 * eased),
              nodes: Math.floor(100 * eased),
              spinup: Math.floor(148 * eased),
              uptime: Number((99.99 * eased).toFixed(2)),
            });

            if (progress < 1) {
              requestAnimationFrame(animateCounts);
            } else {
              setCounts({ latency: 12, nodes: 100, spinup: 148, uptime: 99.99 });
            }
          };

          requestAnimationFrame(animateCounts);
        }
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={containerRef} className="py-20 px-4 max-w-6xl mx-auto relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsData.map((stat) => (
          <StatCard key={stat.id} stat={stat} count={counts[stat.id]} />
        ))}
      </div>
    </section>
  );
}
