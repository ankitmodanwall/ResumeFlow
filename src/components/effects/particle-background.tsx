
"use client";

import React, { useState, useEffect } from 'react';
import { useSprings, animated, config as springConfig } from '@react-spring/web';

const NUM_PARTICLES = 30;

const getRandom = (min: number, max: number): number => Math.random() * (max - min) + min;

interface ParticleDefinition {
  id: string;
  initialLeft: string;
  initialWidth: string;
  initialHeight: string;
  duration: number;
  startDelay: number;
  targetY: number;
  targetRotate: number;
}

export function ParticleBackground() {
  const [particleDefs, setParticleDefs] = useState<ParticleDefinition[] | null>(null);

  useEffect(() => {
    // Generate definitions only on the client, after mount
    const defs: ParticleDefinition[] = Array.from({ length: NUM_PARTICLES }).map((_, index) => {
      const size = getRandom(4, 16);
      return {
        id: `particle-${index}-${crypto.randomUUID()}`, // crypto.randomUUID is client-side
        initialLeft: `${getRandom(0, 100)}vw`,
        initialWidth: `${size}px`,
        initialHeight: `${size}px`,
        duration: getRandom(10000, 20000),
        startDelay: getRandom(0, 15000),
        targetY: -120, // vh
        targetRotate: getRandom(-450, 450), // degrees
      };
    });
    setParticleDefs(defs);
  }, []); // Empty dependency array ensures this runs once on mount

  const springs = useSprings(
    NUM_PARTICLES,
    i => {
      if (!particleDefs || !particleDefs[i]) {
        // Return a default, non-visible, or non-animating state if definitions are not ready
        return {
          from: { opacity: 0, y: 20, rotate: 0 },
          to: { opacity: 0, y: 20, rotate: 0 },
          config: { duration: 1 },
          reset: true, // Ensures spring updates when real definitions arrive
        };
      }

      const def = particleDefs[i];
      return {
        from: { opacity: 0, y: 20, rotate: 0 }, // y in vh, rotate in deg
        to: { opacity: [0, 1, 0.8, 0], y: def.targetY, rotate: def.targetRotate },
        config: { duration: def.duration, easing: (t: number) => t }, // Linear easing
        delay: def.startDelay,
        loop: { reset: true },
      };
    }
  );

  // Render nothing until particle definitions are generated on the client
  if (!particleDefs) {
    return <div aria-hidden="true" className="animated-bg-particles"></div>;
  }

  return (
    <div aria-hidden="true" className="animated-bg-particles">
      {springs.map((animatedStyleProps, i) => {
        const def = particleDefs[i];
        // This check should ideally not be necessary if !particleDefs above handles it,
        // but as a safeguard:
        if (!def) return null; 

        return (
          <animated.span
            key={def.id} // Use stable, unique ID
            className="particle-react-spring"
            style={{
              // Static styles from our client-generated definition
              left: def.initialLeft,
              width: def.initialWidth,
              height: def.initialHeight,
              // Animated styles from react-spring
              opacity: animatedStyleProps.opacity,
              transform: animatedStyleProps.y.to(
                (yValue) => `translateY(${yValue}vh) rotate(${animatedStyleProps.rotate.get()}deg)`
              ),
            }}
          />
        );
      })}
    </div>
  );
}
