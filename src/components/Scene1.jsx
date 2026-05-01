import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AtmosphereLayer from './AtmosphereLayer';

gsap.registerPlugin(ScrollTrigger);

export default function Scene1() {
  const containerRef = useRef(null);
  const scene1BgRef = useRef(null);
  const scene2BgRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=800%',
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });



      // (Removed initial overlay fade so Scene 1 is visible immediately)

      // Crossfade: Fade in Scene 2 text (masked image) over Scene 1
      tl.to(scene2BgRef.current, {
        opacity: 1,
        duration: 1.5,
        ease: 'power1.inOut',
      }, 0.3);

      // Fade in the Katana title
      tl.to(titleRef.current, {
        opacity: 1,
        duration: 1.0,
        ease: 'power2.out',
      }, 0.1);

      // Crossfade: As Scene 2 fades in, slowly fade out Scene 1 image
      tl.to(scene1BgRef.current, {
        opacity: 0,
        duration: 1.5,
        ease: 'power1.inOut',
      }, 0.3);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="scene" id="scene1" ref={containerRef}>
      <img src="/assets/images/scene 1.png" className="scene1-bg" alt="Katana Scene 1" ref={scene1BgRef} />
      
      {/* Scene 2 Image hidden initially but stacked on top */}
      <img src="/assets/images/scene 2.png" className="scene2-bg" alt="Katana Scene 2" ref={scene2BgRef} style={{ opacity: 0, transform: 'translate(-50%, -50%)' }} />
      
      <div className="corner-fog"></div>
      
      {/* Central Title Image */}
      <img src="/assets/images/name.png" className="title-image" alt="Katana Title" ref={titleRef} style={{ opacity: 0 }} />
      
      {/* Three.js Atmosphere Layer for Embers and Heat Distortion */}
      <AtmosphereLayer />
    </div>
  );
}
