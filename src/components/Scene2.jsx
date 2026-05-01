import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AshParticles from './AshParticles';

gsap.registerPlugin(ScrollTrigger);

export default function Scene2() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const energyLineRef = useRef(null);
  const heatLayerRef = useRef(null);
  const glowRef = useRef(null);
  const bloomRef = useRef(null);
  const textRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=400%',
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      // === HORIZONTAL PAN (entire duration) ===
      tl.to(trackRef.current, {
        xPercent: -60,
        ease: 'none',
        duration: 1,
      }, 0);

      // === MICRO CAMERA MOTION (subtle scale 1 → 1.03) ===
      tl.to(containerRef.current, {
        scale: 1.03,
        ease: 'none',
        duration: 1,
      }, 0);

      // === ENERGY LINE — travels left → right synced to scroll ===
      tl.fromTo(energyLineRef.current,
        { left: '-5%', opacity: 0 },
        { left: '100%', opacity: 1, ease: 'none', duration: 1 },
        0
      );

      // === REACTIVE HEAT DISTORTION — follows the energy line ===
      tl.fromTo(heatLayerRef.current,
        { left: '-15%', opacity: 0 },
        { left: '90%', opacity: 0.6, ease: 'none', duration: 1 },
        0
      );

      // === TEXT REVEALS — synced to energy line position ===
      
      // Phase 1: "It begins with intent." — energy at ~15% of blade
      tl.to(textRefs.current[0], { opacity: 1, y: -15, duration: 0.08, ease: 'power2.out' }, 0.05);
      tl.to(textRefs.current[0], { opacity: 0, y: -30, duration: 0.08, ease: 'power2.in' }, 0.2);

      // Phase 2: "Forged in fire." — energy at ~35% of blade
      tl.to(textRefs.current[1], { opacity: 1, y: -15, duration: 0.08, ease: 'power2.out' }, 0.25);
      tl.to(textRefs.current[1], { opacity: 0, y: -30, duration: 0.08, ease: 'power2.in' }, 0.45);

      // Phase 3: "Shaped by discipline." — energy at ~60% of blade
      tl.to(textRefs.current[2], { opacity: 1, y: -15, duration: 0.08, ease: 'power2.out' }, 0.5);
      tl.to(textRefs.current[2], { opacity: 0, y: -30, duration: 0.08, ease: 'power2.in' }, 0.7);

      // Phase 4: "Balance defines the strike." — energy at ~85% of blade
      tl.to(textRefs.current[3], { opacity: 1, y: -15, duration: 0.08, ease: 'power2.out' }, 0.75);
      tl.to(textRefs.current[3], { opacity: 0, y: -30, duration: 0.08, ease: 'power2.in' }, 0.9);

      // === EXIT TRANSITION ===
      // Energy line brightens
      tl.to(energyLineRef.current, {
        boxShadow: '0 0 40px 15px rgba(212, 175, 55, 0.6)',
        duration: 0.05,
        ease: 'power2.in',
      }, 0.92);

      // Light bloom flash
      tl.to(bloomRef.current, { opacity: 0.5, duration: 0.04, ease: 'power2.in' }, 0.95);
      tl.to(bloomRef.current, { opacity: 0, duration: 0.05, ease: 'power2.out' }, 0.99);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="scene" id="scene2" ref={containerRef} style={{ overflow: 'hidden', background: '#000' }}>
      
      {/* Katana Track — wide image that pans horizontally */}
      <img 
        src="/assets/images/scene 3.jpg" 
        className="katana-track" 
        alt="Katana Pan" 
        ref={trackRef} 
      />
      
      {/* Energy Line — travels along the blade */}
      <div className="energy-line" ref={energyLineRef}></div>

      {/* Reactive Heat Distortion — follows energy line */}
      <div className="heat-layer" ref={heatLayerRef}></div>

      {/* Particle Layer — subtle ash */}
      <AshParticles opacity={0.25} />

      {/* Text Reveals — positioned at corners, synced to energy progress */}
      <div className="text-word top-left" ref={el => textRefs.current[0] = el}>It begins with intent.</div>
      <div className="text-word top-right" ref={el => textRefs.current[1] = el}>Forged in fire.</div>
      <div className="text-word bottom-left" ref={el => textRefs.current[2] = el}>Shaped by discipline.</div>
      <div className="text-word bottom-right" ref={el => textRefs.current[3] = el}>Balance defines the strike.</div>

      {/* Light Bloom for exit transition */}
      <div className="light-bloom" ref={bloomRef}></div>

    </div>
  );
}
