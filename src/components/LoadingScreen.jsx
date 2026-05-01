import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function LoadingScreen({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const loadingScreenRef = useRef(null);
  const progressContainerRef = useRef(null);
  const loadingTextRef = useRef(null);
  const scrollPromptRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    // Generate particles
    if (particlesRef.current && particlesRef.current.children.length === 0) {
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${20 + Math.random() * 60}%`;
        particle.style.setProperty('--drift', `${(Math.random() - 0.5) * 100}px`);
        particle.style.animationDelay = `${Math.random() * 4}s`;
        particlesRef.current.appendChild(particle);
      }
    }

    // Simulate loading progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress > 100) currentProgress = 100;
      setProgress(currentProgress);

      if (currentProgress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          gsap.to(progressContainerRef.current, { opacity: 0, duration: 0.5 });
          gsap.to(loadingTextRef.current, { opacity: 0, duration: 0.5 });
          gsap.to(scrollPromptRef.current, { opacity: 1, duration: 1.5, delay: 0.5 });
          setIsLoaded(true);
          if (onLoaded) onLoaded();
        }, 500);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [onLoaded]);

  useEffect(() => {
    if (isLoaded) {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          if (loadingScreenRef.current) {
            loadingScreenRef.current.classList.add('hidden');
          }
          window.removeEventListener('scroll', handleScroll);
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isLoaded]);

  return (
    <div id="loading-screen" ref={loadingScreenRef}>
      <div className="loading-particles" ref={particlesRef}></div>
      <div className="katana-silhouette">
        <div className="blade-glow"></div>
      </div>
      <div className="loading-text" ref={loadingTextRef}>Forging the Legend...</div>
      <div className="progress-container" ref={progressContainerRef}>
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="scroll-prompt" id="scrollPrompt" ref={scrollPromptRef}>Scroll to Awaken</div>
    </div>
  );
}
