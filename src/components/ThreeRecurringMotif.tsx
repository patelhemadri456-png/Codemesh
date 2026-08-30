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

    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // 1. Celestial Planet Sphere
    const sphereGeo = new THREE.SphereGeometry(variant === "cta" ? 4.8 : 4.0, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x222222,
      wireframe: true,
      transparent: true,
      opacity: variant === "cta" ? 0.45 : 0.3,
    });
    const planet = new THREE.Mesh(sphereGeo, sphereMat);
    planetGroup.add(planet);

    // 2. Dense Inner Core
    const coreGeo = new THREE.IcosahedronGeometry(variant === "cta" ? 3.2 : 2.6, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xd4d4d8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const innerCore = new THREE.Mesh(coreGeo, coreMat);
    planetGroup.add(innerCore);

    // 3. Planetary Orbital Rings
    const ringGeo = new THREE.RingGeometry(variant === "cta" ? 6.5 : 5.4, variant === "cta" ? 10.5 : 8.8, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x111111,
      wireframe: true,
      transparent: true,
      opacity: variant === "cta" ? 0.35 : 0.25,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.3;
    planetGroup.add(ring);

    // 4. Outer Orbital Track
    const orbitTrackGeo = new THREE.TorusGeometry(variant === "cta" ? 11.5 : 9.8, 0.12, 16, 80);
    const orbitTrackMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      wireframe: true,
    });
    const orbitTrack = new THREE.Mesh(orbitTrackGeo, orbitTrackMat);
    orbitTrack.rotation.x = Math.PI / 1.7;
    planetGroup.add(orbitTrack);

    // Orbiting Mesh Satellite
    const satGeo = new THREE.OctahedronGeometry(0.4);
    const satMat = new THREE.MeshBasicMaterial({ color: 0x0066ff, wireframe: true });
    const satellite = new THREE.Mesh(satGeo, satMat);
    planetGroup.add(satellite);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 3.5, 60);
    pointLight.position.set(14, 10, 12);
    scene.add(pointLight);

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

      planetGroup.rotation.x = elapsed * 0.12 + mouseY + scrollFactor;
      planetGroup.rotation.y = elapsed * 0.16 + mouseX + scrollFactor * 0.5;

      planet.rotation.y = elapsed * 0.2;
      innerCore.rotation.y = -elapsed * 0.25;
      ring.rotation.z = elapsed * 0.08;
      orbitTrack.rotation.z = -elapsed * 0.12;

      // Orbit satellite
      const satDist = variant === "cta" ? 8.5 : 7.2;
      satellite.position.set(
        Math.cos(elapsed * 0.8) * satDist,
        Math.sin(elapsed * 0.6) * 1.5,
        Math.sin(elapsed * 0.8) * satDist
      );
      satellite.rotation.x = elapsed * 2;

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
      sphereGeo.dispose();
      sphereMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      orbitTrackGeo.dispose();
      orbitTrackMat.dispose();
      satGeo.dispose();
      satMat.dispose();
    };
  }, [variant]);

  return <div ref={containerRef} className={`w-full h-full pointer-events-none ${className}`} />;
}
