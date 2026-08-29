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

    // 1. Signature Motif: Nested Gyroscopic Torus Rings & Icosahedron Wireframe Core
    const outerRingGeo = new THREE.TorusGeometry(variant === "cta" ? 7.8 : 6.8, 0.28, 24, 80);
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0x8a2be2,
      emissive: 0x4a108a,
      wireframe: true,
      transparent: true,
      opacity: variant === "cta" ? 0.45 : 0.32,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    group.add(outerRing);

    const midRingGeo = new THREE.TorusGeometry(variant === "cta" ? 5.8 : 5.0, 0.22, 20, 60);
    const midRingMat = new THREE.MeshStandardMaterial({
      color: 0xffb786,
      emissive: 0x883300,
      wireframe: true,
      transparent: true,
      opacity: variant === "cta" ? 0.5 : 0.35,
    });
    const midRing = new THREE.Mesh(midRingGeo, midRingMat);
    midRing.rotation.x = Math.PI / 3;
    group.add(midRing);

    const coreGeo = new THREE.IcosahedronGeometry(variant === "cta" ? 3.6 : 3.0, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xd0bcff,
      emissive: 0x5b21b6,
      wireframe: true,
      transparent: true,
      opacity: variant === "cta" ? 0.6 : 0.4,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // 2. Point Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const purpleLight = new THREE.PointLight(0xd0bcff, 3, 50);
    purpleLight.position.set(12, 10, 10);
    scene.add(purpleLight);

    const orangeLight = new THREE.PointLight(0xffb786, 3, 50);
    orangeLight.position.set(-12, -8, 10);
    scene.add(orangeLight);

    // 3. Scroll Parallax & Mouse Interactivity
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

      // Scroll Parallax rotation & translation
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
