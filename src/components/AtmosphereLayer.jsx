import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleSystem = () => {
  const pointsRef = useRef();
  
  // Create 150 particles for a dense swarm of rising sparks
  const particleCount = 150;
  
  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const phs = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      // Start at bottom (-15) and die gracefully mid-screen (3)
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() * 18) - 15; 
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
      phs[i] = Math.random() * Math.PI * 2;
    }
    return [pos, phs];
  }, [particleCount]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      const positionsAttr = pointsRef.current.geometry.attributes.position;
      
      for (let i = 0; i < particleCount; i++) {
        // Faster upward drift for sparks
        positionsAttr.array[i * 3 + 1] += 0.025 + Math.random() * 0.01;
        
        // Slight random horizontal drift
        positionsAttr.array[i * 3] += Math.sin(time * 0.5 + phases[i]) * 0.003;
        
        // Reset if it goes too high (mid-screen)
        if (positionsAttr.array[i * 3 + 1] > 3) {
          positionsAttr.array[i * 3 + 1] = -15 - Math.random() * 2; // Spawn right at the bottom
          positionsAttr.array[i * 3] = (Math.random() - 0.5) * 30;
        }
      }
      positionsAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ff3300" // Red/Orange flame color
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default function AtmosphereLayer() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 8 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ParticleSystem />
      </Canvas>
      
      {/* SVG Heat Distortion Filter */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }}>
        <defs>
          <filter id="heat-distortion">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.01 0.05" 
              numOctaves="2" 
              result="noise" 
            >
              <animate 
                attributeName="baseFrequency" 
                dur="10s" 
                values="0.01 0.05; 0.015 0.06; 0.01 0.05" 
                repeatCount="indefinite" 
              />
            </feTurbulence>
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="2" 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </defs>
      </svg>
      
      {/* Apply filter to a pseudo layer if we want to distort the background */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        backdropFilter: 'url(#heat-distortion)',
        WebkitBackdropFilter: 'url(#heat-distortion)',
        opacity: 0.8,
      }}></div>
    </div>
  );
}
