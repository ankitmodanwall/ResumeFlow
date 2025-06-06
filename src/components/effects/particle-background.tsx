
"use client";

import React, { useState, useEffect } from 'react';

export function ParticleBackground() {
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }).map((_, i) => { // Increased particle count
        const size = Math.random() * 12 + 4; // Particle size: 4px to 16px (slightly larger min)
        return (
          <span key={`particle-${i}`} style={{
            left: `${Math.random() * 100}vw`, // Random horizontal position
            width: `${size}px`,
            height: `${size}px`, // Ensure particles are circles
            animationDelay: `${Math.random() * 15}s`, // Random start delay
            animationDuration: `${Math.random() * 10 + 10}s`, // Random duration (10s to 20s) - faster cycle
          }}></span>
        );
      });
      setParticles(newParticles);
    };
    generateParticles(); // Generate particles on client mount
  }, []); // Empty dependency array ensures this runs once on mount

  if (particles.length === 0) {
    return null; // Avoid rendering the container div until particles are generated
  }

  return (
    <div aria-hidden="true" className="animated-bg-particles">
      {particles}
    </div>
  );
}

