
"use client";

import React, { useState, useEffect } from 'react';

export function ParticleBackground() {
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 15 }).map((_, i) => {
        const size = Math.random() * 12 + 3; // Particle size: 3px to 15px
        return (
          <span key={`particle-${i}`} style={{
            left: `${Math.random() * 100}vw`, // Random horizontal position
            width: `${size}px`,
            height: `${size}px`, // Ensure particles are circles
            animationDelay: `${Math.random() * 15}s`, // Random start delay
            animationDuration: `${Math.random() * 20 + 15}s`, // Random duration (15s to 35s)
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
