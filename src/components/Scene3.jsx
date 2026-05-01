import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AshParticles from "./AshParticles";

gsap.registerPlugin(ScrollTrigger);

export default function Scene3() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const sweepRef = useRef(null);
  const textRef = useRef(null);
  const bloomRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%", // 6 phases across long scroll
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      // Initially set the image slightly dimmed
      gsap.set(canvasRef.current, { opacity: 0.85, scale: 1, yPercent: 0 });

      // === PHASE 1: ENTRY (0 -> 0.15) ===
      tl.to(
        canvasRef.current,
        { scale: 1.05, opacity: 1, duration: 0.15, ease: "power1.inOut" },
        0,
      );

      // === PHASE 2: SWORD 1 FOCUS (0.15 -> 0.35) ===
      tl.to(
        canvasRef.current,
        { scale: 1.5, yPercent: 25, duration: 0.2, ease: "power2.inOut" },
        0.15,
      );
      tl.to(
        overlayRef.current,
        { opacity: 1, duration: 0.2, ease: "power1.inOut" },
        0.15,
      );

      // Light Sweep
      tl.fromTo(
        sweepRef.current,
        { x: "-50vw", opacity: 0 },
        { x: "150vw", opacity: 0.8, duration: 0.15, ease: "power1.inOut" },
        0.2,
      );

      // Text reveal
      tl.to(
        textRef.current,
        { opacity: 1, y: -20, duration: 0.1, ease: "power2.out" },
        0.2,
      );

      // === PHASE 3: SWORD 2 FOCUS (0.35 -> 0.55) ===
      tl.to(
        canvasRef.current,
        { yPercent: 0, duration: 0.2, ease: "power2.inOut" },
        0.35,
      );
      tl.to(
        textRef.current,
        { opacity: 0, y: -50, duration: 0.1, ease: "power2.in" },
        0.35,
      );

      // Reset and trigger light sweep again
      tl.fromTo(
        sweepRef.current,
        { x: "-50vw", opacity: 0 },
        { x: "150vw", opacity: 0.6, duration: 0.15, ease: "power1.inOut" },
        0.4,
      );

      // === PHASE 4: SWORD 3 FOCUS (0.55 -> 0.75) ===
      tl.to(
        canvasRef.current,
        { yPercent: -23, duration: 0.2, ease: "power2.inOut" },
        0.55,
      );

      // === PHASE 5: SWORD 4 FOCUS (0.75 -> 0.90) ===
      tl.to(
        canvasRef.current,
        { yPercent: -50, scale: 1.6, duration: 0.15, ease: "power2.inOut" },
        0.75,
      );

      // Final sweep
      tl.fromTo(
        sweepRef.current,
        { x: "-50vw", opacity: 0 },
        { x: "150vw", opacity: 0.9, duration: 0.15, ease: "power1.inOut" },
        0.8,
      );

      // === PHASE 6: MERGE & ZOOM OUT (0.90 -> 1.0) ===
      tl.to(
        canvasRef.current,
        {
          yPercent: 0,
          scale: 1,
          opacity: 0.85,
          duration: 0.1,
          ease: "power2.inOut",
        },
        0.9,
      );
      tl.to(
        overlayRef.current,
        { opacity: 0, duration: 0.1, ease: "power1.inOut" },
        0.9,
      );

      // === EXIT TRANSITION: BLOOM FLASH ===
      tl.to(
        bloomRef.current,
        { opacity: 0.6, duration: 0.05, ease: "power2.in" },
        0.95,
      );
      tl.to(
        bloomRef.current,
        { opacity: 0, duration: 0.05, ease: "power2.out" },
        1.0,
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="scene"
      id="scene3"
      ref={containerRef}
      style={{ overflow: "hidden", background: "#050505" }}
    >
      <div className="sword-canvas-container" ref={canvasRef}>
        <img
          src="/assets/images/multiple-swords.png"
          className="sword-canvas"
          alt="Katana Forms"
        />
      </div>

      <div className="focus-overlay" ref={overlayRef}></div>

      <div
        className="light-sweep"
        ref={sweepRef}
        style={{ top: "35%", height: "30%" }}
      ></div>

      <AshParticles opacity={0.15} />

      <div className="scene3-text" ref={textRef}>
        Each form carries its own purpose.
      </div>

      <div className="light-bloom" ref={bloomRef}></div>
    </div>
  );
}
