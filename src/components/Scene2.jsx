import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Scene2() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const highlightRef = useRef(null);
  const textRefs = useRef([]);
  const bloomRef = useRef(null);

  useEffect(() => {
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

      // Video scrubbing with zoom reveal
      tl.fromTo(videoRef.current,
        { scale: 2.5 },
        {
          currentTime: () => videoRef.current?.duration || 10,
          scale: 1,
          duration: 1.1,
          ease: 'none'
        }, 0);

      // Blade highlight
      tl.to(highlightRef.current, {
        opacity: 0.6,
        duration: 0.3,
        ease: 'power1.inOut'
      }, 0.2);

      // Text sequence
      tl.to(textRefs.current[0], { opacity: 1, x: 0, duration: 0.2, ease: 'power2.out' }, 0.3);
      tl.to(textRefs.current[1], { opacity: 1, x: 0, duration: 0.2, ease: 'power2.out' }, 0.45);
      tl.to(textRefs.current[2], { opacity: 1, x: 0, duration: 0.2, ease: 'power2.out' }, 0.6);
      tl.to(textRefs.current[3], { opacity: 1, x: 0, duration: 0.2, ease: 'power2.out' }, 0.75);

      // Transition
      tl.to(bloomRef.current, { opacity: 0.6, duration: 0.15, ease: 'power2.inOut' }, 0.9);
      tl.to(bloomRef.current, { opacity: 0, duration: 0.1, ease: 'power2.out' }, 1);

    }, containerRef);

    // Wait for video metadata to be loaded before updating scroll triggers
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
    <div className="scene" id="scene2" ref={containerRef}>
      <video className="scene-video" ref={videoRef} muted playsInline preload="auto">
        <source src="/assets/videos/video2-optimized.mp4" type="video/mp4" />
      </video>
      <div className="scene-overlay"></div>
      <div className="blade-highlight" ref={highlightRef}></div>
      <div className="light-bloom" ref={bloomRef}></div>
      <div className="text-sequence">
        <div className="text-word top-left" ref={el => textRefs.current[0] = el}>Precision</div>
        <div className="text-word top-right" ref={el => textRefs.current[1] = el}>Discipline</div>
        <div className="text-word bottom-left" ref={el => textRefs.current[2] = el}>Craft</div>
        <div className="text-word bottom-right" ref={el => textRefs.current[3] = el}>Silence</div>
      </div>
    </div>
  );
}
