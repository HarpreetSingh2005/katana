import React, { useEffect, useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Scene1 from './components/Scene1';
import Scene2 from './components/Scene2';
import Scene3 from './components/Scene3';
import './index.css';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Scroll Progress Bar
    const handleScroll = () => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      const progressEl = document.getElementById('scrollProgress');
      if (progressEl) {
        progressEl.style.width = scrolled + '%';
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      document.body.classList.add('loaded');
    }
  }, [isLoaded]);

  return (
    <>
      <LoadingScreen onLoaded={() => setIsLoaded(true)} />
      
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" id="scrollProgress"></div>
      
      <div className={`app-content ${isLoaded ? 'loaded' : ''}`}>
        <Scene1 />
        <Scene2 />
        <Scene3 />
      </div>
    </>
  );
}

export default App;
