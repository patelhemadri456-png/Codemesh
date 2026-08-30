"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLError, setWebGLError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGLError(true);
        return;
      }
    } catch {
      setWebGLError(true);
      return;
    }

    let animationFrameId: number;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 32);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    const cosmicGroup = new THREE.Group();
    scene.add(cosmicGroup);

    // ==========================================
    // 1. CELESTIAL 3D PLANET (Main Orbital Sphere)
    // ==========================================
    const planetGroup = new THREE.Group();
    planetGroup.position.set(15, 3, -6);
    cosmicGroup.add(planetGroup);

    // Planet Core Sphere (Luminous Wireframe Topography)
    const planetGeo = new THREE.SphereGeometry(4.2, 36, 36);
    const planetMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x222222,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      roughness: 0.3,
      metalness: 0.9,
    });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    planetGroup.add(planet);

    // Planet Inner Dense Core
    const innerCoreGeo = new THREE.IcosahedronGeometry(3.0, 2);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0xd4d4d8,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    planetGroup.add(innerCore);

    // Primary Planetary Ring (Saturn-Style Planetary Disk)
    const ringGeo = new THREE.RingGeometry(5.6, 8.8, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x111111,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
    });
    const planetRing = new THREE.Mesh(ringGeo, ringMat);
    planetRing.rotation.x = Math.PI / 2.4;
    planetRing.rotation.y = Math.PI / 8;
    planetGroup.add(planetRing);

    // Secondary Outer Orbit Gyroscopic Ring
    const outerOrbitGeo = new THREE.TorusGeometry(10.2, 0.12, 16, 100);
    const outerOrbitMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const outerOrbit = new THREE.Mesh(outerOrbitGeo, outerOrbitMat);
    outerOrbit.rotation.x = Math.PI / 1.8;
    planetGroup.add(outerOrbit);

    // Orbiting Satellites (Active Mesh Nodes)
    const satellites: THREE.Mesh[] = [];
    const satelliteCount = 3;
    for (let i = 0; i < satelliteCount; i++) {
      const satGeo = new THREE.OctahedronGeometry(0.35);
      const satMat = new THREE.MeshBasicMaterial({
        color: i === 0 ? 0x0066ff : i === 1 ? 0xff7e33 : 0xffffff,
        wireframe: true,
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      planetGroup.add(sat);
      satellites.push(sat);
    }

    // ==========================================
    // 2. SECONDARY DISTANT MOON / CELESTIAL NODE (Left)
    // ==========================================
    const moonGroup = new THREE.Group();
    moonGroup.position.set(-16, -4, -8);
    cosmicGroup.add(moonGroup);

    const moonGeo = new THREE.SphereGeometry(2.4, 20, 20);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moon);

    const moonRingGeo = new THREE.RingGeometry(3.2, 4.4, 32);
    const moonRing = new THREE.Mesh(moonRingGeo, ringMat);
    moonRing.rotation.x = Math.PI / 3;
    moonGroup.add(moonRing);

    // ==========================================
    // 3. COSMIC STARFIELD & CELESTIAL DUST FIELD
    // ==========================================
    const starCount = 600;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + Math.random() * 32;
      starPositions[i] = Math.cos(angle) * radius;
      starPositions[i + 1] = (Math.random() - 0.5) * 30;
      starPositions[i + 2] = (Math.random() - 0.5) * 24 - 4;
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.16,
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    cosmicGroup.add(starField);

    // ==========================================
    // 4. PLANETARY HORIZON GRID
    // ==========================================
    const gridHelper = new THREE.GridHelper(120, 40, 0x3f3f46, 0x18181b);
    gridHelper.position.y = -14;
    gridHelper.position.z = -6;
    cosmicGroup.add(gridHelper);

    // ==========================================
    // 5. CRISP CELESTIAL LIGHTS
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const starLight1 = new THREE.PointLight(0xffffff, 3.5, 70);
    starLight1.position.set(16, 10, 14);
    scene.add(starLight1);

    const starLight2 = new THREE.PointLight(0x0066ff, 1.5, 60);
    starLight2.position.set(-16, -6, 10);
    scene.add(starLight2);

    // Mouse Tracking with smooth damping
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      targetMouseX = (e.clientX - windowHalfX) * 0.0006;
      targetMouseY = (e.clientY - windowHalfY) * 0.0006;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (currentTime - startTime) * 0.001;

      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      cosmicGroup.rotation.y = currentMouseX + elapsedTime * 0.015;
      cosmicGroup.rotation.x = currentMouseY + Math.sin(elapsedTime * 0.1) * 0.02;

      // Rotate planet sphere & rings
      planet.rotation.y = elapsedTime * 0.18;
      innerCore.rotation.y = -elapsedTime * 0.25;
      planetRing.rotation.z = elapsedTime * 0.08;
      outerOrbit.rotation.z = -elapsedTime * 0.12;

      // Orbit satellites around the planet
      satellites.forEach((sat, idx) => {
        const satAngle = elapsedTime * (0.6 + idx * 0.25) + (idx * Math.PI * 2) / satelliteCount;
        const satDist = 7.0 + idx * 1.4;
        sat.position.set(
          Math.cos(satAngle) * satDist,
          Math.sin(satAngle * 0.8) * 1.8,
          Math.sin(satAngle) * satDist
        );
        sat.rotation.x = elapsedTime * 2;
        sat.rotation.y = elapsedTime * 2;
      });

      // Rotate distant moon
      moon.rotation.y = elapsedTime * 0.15;
      moonRing.rotation.z = -elapsedTime * 0.1;
      starField.rotation.y = -elapsedTime * 0.008;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      planetGeo.dispose();
      planetMat.dispose();
      innerCoreGeo.dispose();
      innerCoreMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      outerOrbitGeo.dispose();
      outerOrbitMat.dispose();
      moonGeo.dispose();
      moonMat.dispose();
      moonRingGeo.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Subtle Cosmic Atmospheric Glow Arcs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-white/[0.04] blur-[160px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-4 w-[500px] h-[500px] bg-[#0066FF]/[0.05] blur-[170px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 left-4 w-[450px] h-[400px] bg-white/[0.02] blur-[150px] rounded-full -z-10 pointer-events-none" />

      {webGLError && (
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.05),transparent_70%)]" />
      )}
    </div>
  );
}
