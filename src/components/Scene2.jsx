import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AshParticles from './AshParticles';

gsap.registerPlugin(ScrollTrigger);

const TEXTS = [
  {
    headline: 'It Begins With Intent',
    sub: 'The mind moves before the blade does.',
  },
  {
    headline: 'Forged in Fire',
    sub: 'A thousand folds — a thousand choices made.',
  },
  {
    headline: 'Shaped by Discipline',
    sub: 'Every edge is a year of silence and sacrifice.',
  },
  {
    headline: 'Balance Defines the Strike',
    sub: 'Not strength. Not speed. Precision alone.',
  },
];

export default function Scene2() {
  const containerRef  = useRef(null);
  const trackRef      = useRef(null);
  const energyLineRef = useRef(null);
  const heatLayerRef  = useRef(null);
  const bloomRef      = useRef(null);
  const textRefs      = useRef([]);

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

      // ── Horizontal pan across the blade ──────────────────────────
      tl.to(trackRef.current, { xPercent: -60, ease: 'none', duration: 1 }, 0);

      // ── Micro-camera scale (subtle depth) ────────────────────────
      tl.to(containerRef.current, { scale: 1.03, ease: 'none', duration: 1 }, 0);

      // ── Energy line: travels left → right ────────────────────────
      tl.fromTo(energyLineRef.current,
        { left: '-5%', opacity: 0 },
        { left: '100%', opacity: 1, ease: 'none', duration: 1 },
        0
      );

      // ── Heat distortion layer follows energy line ─────────────────
      tl.fromTo(heatLayerRef.current,
        { left: '-15%', opacity: 0 },
        { left: '90%',  opacity: 0.6, ease: 'none', duration: 1 },
        0
      );

      // ── Text reveals: in → hold → out ────────────────────────────
      const beats = [
        [0.05, 0.20],
        [0.25, 0.45],
        [0.50, 0.70],
        [0.75, 0.92],
      ];

      beats.forEach(([inAt, outAt], i) => {
        const el = textRefs.current[i];
        if (!el) return;
        gsap.set(el, { y: 30, opacity: 0 });
        tl.to(el, { opacity: 1, y: 0,   duration: 0.10, ease: 'power2.out' }, inAt);
        tl.to(el, { opacity: 0, y: -20, duration: 0.08, ease: 'power2.in'  }, outAt);
      });

      // ── Exit: energy line brightens then bloom flash ──────────────
      tl.to(energyLineRef.current, {
        boxShadow: '0 0 40px 15px rgba(212,175,55,0.7)',
        duration: 0.05,
        ease: 'power2.in',
      }, 0.93);
      tl.to(bloomRef.current, { opacity: 0.55, duration: 0.04, ease: 'power2.in'  }, 0.96);
      tl.to(bloomRef.current, { opacity: 0,    duration: 0.04, ease: 'power2.out' }, 1.00);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="scene" id="scene2" ref={containerRef}>

      {/* Wide katana image — horizontal pan */}
      <img
        src="/assets/images/scene 3.jpg"
        className="katana-track"
        alt="Katana blade reveal"
        ref={trackRef}
      />

      {/* Slim golden energy line */}
      <div className="energy-line" ref={energyLineRef} />

      {/* Heat distortion region */}
      <div className="heat-layer" ref={heatLayerRef} />

      {/* Subtle ash particles */}
      <AshParticles opacity={0.22} />

      {/* ── Narrative Text Beats ──────────────────────────────────── */}
      {TEXTS.map((t, i) => (
        <div
          key={i}
          className="blade-text"
          ref={el => (textRefs.current[i] = el)}
        >
          <span className="blade-text__headline">{t.headline}</span>
          <span className="blade-text__rule" />
          <span className="blade-text__sub">{t.sub}</span>
        </div>
      ))}

      {/* Exit bloom flash */}
      <div className="light-bloom" ref={bloomRef} />

    </div>
  );
}
