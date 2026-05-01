import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleSystem = ({ opacity }) => {
  const pointsRef = useRef();
  
  // Fewer particles for a subtle ash feel
  const particleCount = 40;
  
  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const phs = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      // Spawn near blade level (centre of screen), drift upward
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() * 8) - 4; 
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      phs[i] = Math.random() * Math.PI * 2;
    }
    return [pos, phs];
  }, [particleCount]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (pointsRef.current) {
      const positionsAttr = pointsRef.current.geometry.attributes.position;
      
      for (let i = 0; i < particleCount; i++) {
        // Very slow upward drift — floating ash, not fire
        positionsAttr.array[i * 3 + 1] += 0.003 + Math.random() * 0.002;
        
        // Gentle horizontal sway
        positionsAttr.array[i * 3] += Math.sin(time * 0.2 + phases[i]) * 0.003;
        
        // Reset when drifted too high — respawn near blade
        if (positionsAttr.array[i * 3 + 1] > 5) {
          positionsAttr.array[i * 3 + 1] = -4 - Math.random() * 2;
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
        size={0.05}
        color="#cc4411"
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default function AshParticles({ opacity = 0.2 }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} clock={new THREE.Clock()}>
        <ParticleSystem opacity={opacity} />
      </Canvas>
      
      {/* Subtle heat distortion SVG filter for the blade */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="heat-distortion-scene2">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </div>
  );
}
