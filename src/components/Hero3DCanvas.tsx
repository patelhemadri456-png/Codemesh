"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLError, setWebGLError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
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

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.0018);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 32;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // Group for mouse parallax
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central 3D Abstract Object: Floating Nested Torus Knot & Wireframe Polyhedron
    const knotGeometry = new THREE.TorusKnotGeometry(6.2, 1.4, 120, 24, 2, 3);
    const knotMaterial = new THREE.MeshStandardMaterial({
      color: 0x8a2be2,
      emissive: 0x3d007a,
      roughness: 0.25,
      metalness: 0.85,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);
    mainGroup.add(knotMesh);

    // Inner glowing core
    const coreGeometry = new THREE.IcosahedronGeometry(3.8, 2);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xffb786,
      emissive: 0xd9531e,
      roughness: 0.3,
      metalness: 0.9,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // 2. Dynamic Particle Field / Constellation Lattice
    const particleCount = 700;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 80;
      particlePositions[i + 1] = (Math.random() - 0.5) * 60;
      particlePositions[i + 2] = (Math.random() - 0.5) * 40 - 5;
      particleScales[i / 3] = Math.random() * 1.5 + 0.5;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute("scale", new THREE.BufferAttribute(particleScales, 1));

    // Particle Material
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.22,
      color: 0xd0bcff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particleSystem);

    // 3. Ground Wireframe Grid with subtle perspective wave
    const gridHelper = new THREE.GridHelper(100, 40, 0x571bc1, 0x1f1f2e);
    gridHelper.position.y = -14;
    gridHelper.position.z = -5;
    mainGroup.add(gridHelper);

    // 4. Lights: Cinematic Purple & Peach / Orange Point Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const purpleLight = new THREE.PointLight(0xd0bcff, 3, 50);
    purpleLight.position.set(15, 12, 10);
    scene.add(purpleLight);

    const orangeLight = new THREE.PointLight(0xffb786, 3.5, 50);
    orangeLight.position.set(-15, -8, 10);
    scene.add(orangeLight);

    // Mouse Tracking with smooth interpolation
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      targetMouseX = (e.clientX - windowHalfX) * 0.0008;
      targetMouseY = (e.clientY - windowHalfY) * 0.0008;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Window Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (currentTime - startTime) * 0.001;

      // Smooth mouse follow
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      mainGroup.rotation.y = currentMouseX + elapsedTime * 0.06;
      mainGroup.rotation.x = currentMouseY + Math.sin(elapsedTime * 0.2) * 0.05;

      // Rotate 3D Torus Knot & Core
      knotMesh.rotation.x = elapsedTime * 0.15;
      knotMesh.rotation.y = elapsedTime * 0.2;
      coreMesh.rotation.x = -elapsedTime * 0.25;
      coreMesh.rotation.y = -elapsedTime * 0.18;

      // Pulse particle positions gently
      particleSystem.rotation.y = -elapsedTime * 0.02;

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
      knotGeometry.dispose();
      knotMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Dynamic Background Glow Overlays */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#571bc1]/20 via-[#9d4edd]/15 to-[#ffb786]/10 blur-[130px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[500px] h-[400px] bg-[#8a2be2]/10 blur-[150px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[450px] h-[350px] bg-[#ff8c42]/10 blur-[140px] rounded-full -z-10 pointer-events-none" />

      {webGLError && (
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_40%,rgba(138,43,226,0.15),transparent_70%)]" />
      )}
    </div>
  );
}
