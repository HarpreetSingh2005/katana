import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Scene4() {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const videoRef = useRef(null);
  const fogRef = useRef(null);
  const embersRef = useRef(null);
  const titleRef = useRef(null);
  const bloomRef = useRef(null);

  useEffect(() => {
    // Create subtle, distant floating embers
    if (embersRef.current && embersRef.current.children.length === 0) {
      for (let i = 0; i < 20; i++) { // Reduced count to 20
        const ember = document.createElement('div');
        ember.className = 'ember-subtle';
        ember.style.position = 'absolute';
        ember.style.width = `${Math.random() * 1 + 1}px`; // 1-2px size
        ember.style.height = ember.style.width;
        ember.style.backgroundColor = '#ffaa55';
        ember.style.borderRadius = '50%';
        ember.style.left = `${Math.random() * 100}%`;
        ember.style.bottom = '-20px';
        ember.style.opacity = '0';
        embersRef.current.appendChild(ember);
      }
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=250%',
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      // 1. Cinematic Camera Pull-back (simulated by scaling inner wrapper)
      tl.fromTo(innerRef.current,
        { scale: 1.1 },
        { scale: 1, duration: 1, ease: 'none' },
        0
      );

      // 2. Video Playback (smooth easing to the end)
      tl.fromTo(videoRef.current,
        { currentTime: 0 },
        {
          currentTime: () => (videoRef.current?.duration || 10), // Play 100%
          duration: 1,
          ease: 'power1.inOut'
        }, 
        0
      );

      // 3. Subtle Fog Fade-in (delayed)
      tl.fromTo(fogRef.current,
        { opacity: 0 },
        {
          opacity: 0.35, // Max opacity 0.3-0.4
          duration: 0.6,
          ease: 'power1.inOut'
        },
        0.3 // Delay start
      );

      // 4. Distant Embers (Slow upward motion, horizontal drift)
      const embers = embersRef.current.querySelectorAll('.ember-subtle');
      embers.forEach((ember, i) => {
        tl.to(ember, {
          opacity: Math.random() * 0.2 + 0.2, // Opacity 0.2-0.4
          y: -Math.random() * 400 - 300,
          x: (Math.random() - 0.5) * 100, // Slight horizontal drift
          duration: 0.8 + Math.random() * 0.2,
          ease: 'power1.inOut'
        }, i * 0.015);
      });

      // 5. Final Text Reveal (Fix centering by explicitly passing xPercent/yPercent so scale doesn't overwrite it)
      tl.fromTo(titleRef.current,
        { opacity: 0, scale: 1, xPercent: -50, yPercent: -50, left: '50%', top: '50%', position: 'absolute' },
        {
          opacity: 1,
          scale: 1.05,
          xPercent: -50,
          yPercent: -50,
          duration: 0.3,
          ease: 'power1.inOut'
        },
        0.65 // Fade in slowly near the end
      );

      // 6. Emotional Closure: Final Flash
      tl.fromTo(bloomRef.current,
        { opacity: 0 },
        { opacity: 0.6, duration: 0.05, ease: 'power2.in' },
        0.95 // Quick flash at end
      );
      tl.to(bloomRef.current, { opacity: 0, duration: 0.05, ease: 'power2.out' }, 1.0); // Fade out

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
    <div className="scene" id="scene4" ref={containerRef} style={{ background: '#000', overflow: 'hidden', position: 'relative', width: '100vw', height: '100vh' }}>
      <div ref={innerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', willChange: 'transform' }}>
        <video className="scene-video" ref={videoRef} muted playsInline preload="auto" style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
          <source src="/assets/videos/video3-optimized.mp4" type="video/mp4" />
        </video>
        <div className="scene-overlay" style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)', 
          pointerEvents: 'none' 
        }}></div>
        <div className="atmospheric-fog" ref={fogRef} style={{ pointerEvents: 'none', zIndex: 2 }}></div>
        <div className="embers-container" id="embersContainer4" ref={embersRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3 }}></div>
      </div>
      
      <div className="myth-title" ref={titleRef} style={{ zIndex: 10 }}>
        <div className="myth-kanji">無心</div>
        <div className="myth-subtitle">Mu Shin — No Mind</div>
      </div>

      <div className="light-bloom" id="bloom4" ref={bloomRef} style={{ zIndex: 15 }}></div>
    </div>
  );
}
