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
    scene.fog = new THREE.FogExp2(0x000000, 0.0025);

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

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Pure Monochrome Silver/White 3D Wireframe Geometry
    // Outer Gyroscope Ring
    const torusGeo1 = new THREE.TorusGeometry(8.5, 0.22, 30, 100);
    const torusMat1 = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x333333,
      roughness: 0.1,
      metalness: 0.95,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const torus1 = new THREE.Mesh(torusGeo1, torusMat1);
    torus1.position.set(15, 3, -6);
    torus1.rotation.x = Math.PI / 3;
    mainGroup.add(torus1);

    // Inner Floating Polyhedron (Monochrome Silver Wireframe)
    const icosaGeo1 = new THREE.IcosahedronGeometry(4.0, 1);
    const icosaMat1 = new THREE.MeshStandardMaterial({
      color: 0xe4e4e7,
      emissive: 0x52525b,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const icosa1 = new THREE.Mesh(icosaGeo1, icosaMat1);
    icosa1.position.set(15, 3, -6);
    mainGroup.add(icosa1);

    // Left Secondary Depth Orbital Ring
    const torusGeo2 = new THREE.TorusGeometry(7.2, 0.18, 24, 80);
    const torusMat2 = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      emissive: 0x27272a,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const torus2 = new THREE.Mesh(torusGeo2, torusMat2);
    torus2.position.set(-16, -4, -8);
    torus2.rotation.y = Math.PI / 4;
    mainGroup.add(torus2);

    // 2. Subtle Monochrome Silver Particle Field
    const particleCount = 450;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 12 + Math.random() * 26;
      particlePositions[i] = Math.cos(angle) * radius;
      particlePositions[i + 1] = Math.sin(angle) * radius * 0.65;
      particlePositions[i + 2] = (Math.random() - 0.5) * 20 - 4;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.16,
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particleSystem);

    // 3. Subtle Horizon Floor Grid (Monochrome)
    const gridHelper = new THREE.GridHelper(100, 40, 0x52525b, 0x18181b);
    gridHelper.position.y = -14;
    gridHelper.position.z = -6;
    mainGroup.add(gridHelper);

    // 4. Monochrome Crisp White Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const whiteLight1 = new THREE.PointLight(0xffffff, 3.0, 60);
    whiteLight1.position.set(16, 8, 12);
    scene.add(whiteLight1);

    const whiteLight2 = new THREE.PointLight(0xd4d4d8, 2.0, 60);
    whiteLight2.position.set(-16, -6, 10);
    scene.add(whiteLight2);

    // Mouse Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      targetMouseX = (e.clientX - windowHalfX) * 0.0005;
      targetMouseY = (e.clientY - windowHalfY) * 0.0005;
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

      mainGroup.rotation.y = currentMouseX + elapsedTime * 0.02;
      mainGroup.rotation.x = currentMouseY + Math.sin(elapsedTime * 0.12) * 0.02;

      torus1.rotation.x = elapsedTime * 0.2;
      torus1.rotation.y = elapsedTime * 0.25;
      icosa1.rotation.y = -elapsedTime * 0.3;

      torus2.rotation.z = -elapsedTime * 0.22;
      particleSystem.rotation.y = -elapsedTime * 0.015;

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
      torusGeo1.dispose();
      torusMat1.dispose();
      icosaGeo1.dispose();
      icosaMat1.dispose();
      torusGeo2.dispose();
      torusMat2.dispose();
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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-white/[0.04] blur-[160px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-4 w-[450px] h-[450px] bg-white/[0.03] blur-[160px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 left-4 w-[450px] h-[400px] bg-white/[0.02] blur-[150px] rounded-full -z-10 pointer-events-none" />

      {webGLError && (
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.05),transparent_70%)]" />
      )}
    </div>
  );
}
