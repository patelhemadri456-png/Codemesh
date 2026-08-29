"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeRecurringMotifProps {
  variant?: "hero" | "ambient" | "cta";
  className?: string;
}

export default function ThreeRecurringMotif({
  variant = "hero",
  className = "",
}: ThreeRecurringMotifProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = variant === "cta" ? 26 : 30;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Pure Monochrome Silver/White Nested Torus & Icosahedron Wireframe
    const outerRingGeo = new THREE.TorusGeometry(variant === "cta" ? 7.8 : 6.8, 0.22, 24, 80);
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x333333,
      wireframe: true,
      transparent: true,
      opacity: variant === "cta" ? 0.35 : 0.25,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    group.add(outerRing);

    const midRingGeo = new THREE.TorusGeometry(variant === "cta" ? 5.8 : 5.0, 0.18, 20, 60);
    const midRingMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      emissive: 0x27272a,
      wireframe: true,
      transparent: true,
      opacity: variant === "cta" ? 0.4 : 0.3,
    });
    const midRing = new THREE.Mesh(midRingGeo, midRingMat);
    midRing.rotation.x = Math.PI / 3;
    group.add(midRing);

    const coreGeo = new THREE.IcosahedronGeometry(variant === "cta" ? 3.6 : 3.0, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x52525b,
      wireframe: true,
      transparent: true,
      opacity: variant === "cta" ? 0.5 : 0.35,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Monochrome Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const whiteLight = new THREE.PointLight(0xffffff, 3, 50);
    whiteLight.position.set(12, 10, 10);
    scene.add(whiteLight);

    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY || window.pageYOffset;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const halfX = window.innerWidth / 2;
      const halfY = window.innerHeight / 2;
      mouseX = (e.clientX - halfX) * 0.0006;
      mouseY = (e.clientY - halfY) * 0.0006;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 600;
      const newH = container.clientHeight || 500;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = (currentTime - startTime) * 0.001;

      const scrollFactor = scrollY * 0.0008;

      group.rotation.x = elapsed * 0.15 + mouseY + scrollFactor;
      group.rotation.y = elapsed * 0.2 + mouseX + scrollFactor * 0.5;

      outerRing.rotation.z = elapsed * 0.1;
      midRing.rotation.y = -elapsed * 0.18;
      core.rotation.x = -elapsed * 0.25;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      midRingGeo.dispose();
      midRingMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
    };
  }, [variant]);

  return <div ref={containerRef} className={`w-full h-full pointer-events-none ${className}`} />;
}
