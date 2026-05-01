import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Scene3() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const fogRef = useRef(null);
  const embersRef = useRef(null);
  const titleRef = useRef(null);
  const bloomRef = useRef(null);

  useEffect(() => {
    // Create Embers
    if (embersRef.current && embersRef.current.children.length === 0) {
      for (let i = 0; i < 50; i++) {
        const ember = document.createElement('div');
        ember.className = 'ember';
        ember.style.left = `${Math.random() * 100}%`;
        ember.style.bottom = '-10px';
        embersRef.current.appendChild(ember);
      }
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      // Video with pullback
      tl.fromTo(videoRef.current,
        { scale: 1.3 },
        {
          currentTime: () => videoRef.current?.duration || 10,
          scale: 1,
          duration: 1.1,
          ease: 'none'
        }, 0);

      // Atmospheric fog
      tl.to(fogRef.current, {
        opacity: 0.7,
        duration: 0.3,
        ease: 'power1.inOut'
      }, 0.2);

      // Epic embers
      const embers = embersRef.current.querySelectorAll('.ember');
      embers.forEach((ember, i) => {
        tl.to(ember, {
          opacity: Math.random() * 0.9 + 0.5,
          y: -Math.random() * 800 - 500,
          x: (Math.random() - 0.5) * 300,
          duration: 0.7,
          ease: 'power1.out'
        }, i * 0.008);
      });

      // Title reveal
      tl.to(titleRef.current, {
        opacity: 1,
        scale: 1.1,
        duration: 0.4,
        ease: 'power2.out'
      }, 0.4);

      // Final bloom
      tl.to(bloomRef.current, {
        opacity: 0.5,
        duration: 0.3,
        ease: 'power1.inOut'
      }, 0.5);

      // Dramatic ending
      tl.to(titleRef.current, {
        scale: 1.2,
        duration: 0.3,
        ease: 'power2.inOut'
      }, 0.7);

      tl.to(bloomRef.current, {
        opacity: 0.8,
        duration: 0.2,
        ease: 'power2.in'
      }, 0.9);

    }, containerRef);

    if (videoRef.current) {
      if (videoRef.current.readyState >= 1) {
        ScrollTrigger.refresh();
      } else {
        videoRef.current.addEventListener('loadedmetadata', () => ScrollTrigger.refresh());
      }
    }

    return () => ctx.revert();
  }, []);

  return (
    <div className="scene" id="scene3" ref={containerRef}>
      <video className="scene-video" ref={videoRef} muted playsInline preload="auto">
        <source src="/assets/videos/video3-optimized.mp4" type="video/mp4" />
      </video>
      <div className="scene-overlay"></div>
      <div className="atmospheric-fog" ref={fogRef}></div>
      <div className="embers-container" id="embersContainer3" ref={embersRef}></div>
      <div className="light-bloom" id="bloom3" ref={bloomRef}></div>
      <div className="myth-title" ref={titleRef}>
        <div className="myth-kanji">無心</div>
        <div className="myth-subtitle">Mu Shin — No Mind</div>
      </div>
    </div>
  );
}
