'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { motion } from 'framer-motion';

import styled from 'styled-components';

const VisualizerContainer = styled.div`
  width: 100%;
  height: 600px;
  background: #1a1a1a;
  position: relative;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
`;

export default function DrumVisualizer({ percentFilled = 0, drumHeight = 100, drumDiameter = 60 }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false); // 👈 Fix hydration
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsMounted(true); // allow rendering only after client-side mount
  }, []);

  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    try {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setClearColor(0x000000, 0);
      containerRef.current.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      const spotLight = new THREE.SpotLight(0xffffff, 1);
      spotLight.position.set(10, 10, 10);
      spotLight.castShadow = true;
      scene.add(ambientLight, spotLight);

      // Drum
      const drumGeometry = new THREE.CylinderGeometry(
        drumDiameter / 2,
        drumDiameter / 2,
        drumHeight,
        32
      );
      const drumMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x888888,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.7,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
      });
      const drum = new THREE.Mesh(drumGeometry, drumMaterial);
      scene.add(drum);

      // Filling
      const fillingGeometry = new THREE.CylinderGeometry(
        (drumDiameter / 2) * 0.95,
        (drumDiameter / 2) * 0.95,
        drumHeight * (percentFilled / 100),
        32
      );
      const fillingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ff88,
        metalness: 0.3,
        roughness: 0.4,
        transparent: true,
        opacity: 0.8,
        transmission: 0.2
      });
      const filling = new THREE.Mesh(fillingGeometry, fillingMaterial);
      filling.position.y = -(drumHeight / 2) * (1 - percentFilled / 100);
      scene.add(filling);

      // Animate filling with GSAP
      gsap.to(filling.scale, {
        y: percentFilled / 100,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)"
      });

      // Overflow visuals
      if (percentFilled > 100) {
        const overflowGeometry = new THREE.CylinderGeometry(
          (drumDiameter / 2) * 1.1,
          (drumDiameter / 2) * 1.1,
          drumHeight * 0.2,
          32
        );
        const overflowMaterial = new THREE.MeshPhysicalMaterial({
          color: 0xff0000,
          metalness: 0.5,
          roughness: 0.3,
          transparent: true,
          opacity: 0.8
        });
        const overflow = new THREE.Mesh(overflowGeometry, overflowMaterial);
        overflow.position.y = drumHeight / 2 + drumHeight * 0.1;
        scene.add(overflow);

        // Animate overflow
        gsap.to(overflow.scale, {
          y: 1.2,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      // Add environment map for realistic reflections
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new THREE.Scene()).texture;

      // Add ambient particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particleCount = 100;
      const posArray = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * drumDiameter;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.2,
        color: 0x00ffaa,
        transparent: true,
        opacity: 0.6
      });

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);

      // Animate particles
      gsap.to(particlesMesh.rotation, {
        y: Math.PI * 2,
        duration: 10,
        repeat: -1,
        ease: "none"
      });

      // Camera and controls
      camera.position.set(drumDiameter, drumHeight, drumDiameter);
      camera.lookAt(0, 0, 0);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Resize
      const handleResize = () => {
        if (!containerRef.current) return;
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      setIsLoading(false);

      return () => {
        window.removeEventListener('resize', handleResize);
        containerRef.current?.removeChild(renderer.domElement);
        renderer.dispose(); // Dispose of renderer
        scene.clear();
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize 3D visualization');
      setIsLoading(false);
    }
  }, [isMounted, percentFilled, drumHeight, drumDiameter]);

  if (!isMounted) return null; // 👈 avoid hydration mismatch

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <VisualizerContainer ref={containerRef}>
        {isLoading && (
          <LoadingOverlay>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              Loading visualization...
            </motion.div>
          </LoadingOverlay>
        )}
        {error && (
          <LoadingOverlay>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          </LoadingOverlay>
        )}
      </VisualizerContainer>
    </motion.div>
  );
}