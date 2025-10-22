import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CosmosBackgroundProps {
  mousePosition: { x: number; y: number };
}

export default function CosmosBackground({ mousePosition }: CosmosBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create distant stars - pushed far back
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 8000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;

      // Spread stars across a larger, more distant area
      starPositions[i3] = (Math.random() - 0.5) * 200;
      starPositions[i3 + 1] = (Math.random() - 0.5) * 200;
      starPositions[i3 + 2] = -100 + (Math.random() - 0.5) * 100; // Push far back

      // Mostly white/dim stars with occasional colored ones
      const colorType = Math.random();
      if (colorType < 0.85) {
        // Dim white stars (most common)
        const brightness = 0.6 + Math.random() * 0.4;
        starColors[i3] = brightness;
        starColors[i3 + 1] = brightness;
        starColors[i3 + 2] = brightness;
      } else if (colorType < 0.93) {
        // Subtle blue stars
        starColors[i3] = 0.7;
        starColors[i3 + 1] = 0.8;
        starColors[i3 + 2] = 1;
      } else {
        // Rare warm stars
        starColors[i3] = 1;
        starColors[i3 + 1] = 0.9;
        starColors[i3 + 2] = 0.7;
      }

      // Vary star sizes for depth
      starSizes[i] = Math.random() * 1.5 + 0.5;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    starsRef.current = stars;

    // Animation loop - very subtle movement
    const animate = () => {
      requestAnimationFrame(animate);

      // Extremely subtle drift for stars (barely noticeable)
      if (starsRef.current) {
        starsRef.current.rotation.y += 0.00005;
      }

      // No rotation for Milky Way - keep it stable and distant

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      starGeometry.dispose();
      starMaterial.dispose();
      rendererRef.current?.dispose();
    };
  }, []);

  // React to mouse movement - very subtle parallax effect
  useEffect(() => {
    if (!sceneRef.current || !starsRef.current) return;

    // Very gentle parallax effect for depth perception
    const targetRotationY = mousePosition.x * 0.08;
    const targetRotationX = mousePosition.y * 0.05;

    // Stars move very slightly
    if (starsRef.current) {
      starsRef.current.rotation.y += (targetRotationY - starsRef.current.rotation.y) * 0.01;
      starsRef.current.rotation.x += (targetRotationX - starsRef.current.rotation.x) * 0.01;
    }
  }, [mousePosition]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(ellipse at center, #0d0d1f 0%, #000000 100%)',
        zIndex: 0,
      }}
    />
  );
}
