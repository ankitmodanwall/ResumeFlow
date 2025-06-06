
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
        id: `particle-${index}-${crypto.randomUUID()}`, 
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
  }, []); 

  const springs = useSprings(
    NUM_PARTICLES,
    i => {
      if (!particleDefs || !particleDefs[i]) {
        return {
          from: { opacity: 0, y: 20, rotate: 0 },
          to: async (next: any) => { // Ensure 'to' is a function or array if multi-stage
            await next({ opacity: 0, y: 20, rotate: 0 });
          },
          config: { duration: 1 },
          reset: true,
        };
      }

      const def = particleDefs[i];
      return {
        from: { opacity: 0, y: 20, rotate: 0 }, 
        to: async (next: any) => {
          await next({ opacity: 1, y: def.targetY / 2, rotate: def.targetRotate / 2 }); // Example of multi-stage
          await next({ opacity: 0.8, y: def.targetY * 0.8, rotate: def.targetRotate * 0.8 });
          await next({ opacity: 0, y: def.targetY, rotate: def.targetRotate });
        },
        config: { duration: def.duration, easing: (t: number) => t }, 
        delay: def.startDelay,
        loop: { reset: true },
      };
    }
  );

  if (!particleDefs) {
    return <div aria-hidden="true" className="animated-bg-particles"></div>;
  }

  return (
    <div aria-hidden="true" className="animated-bg-particles">
      {springs.map((animatedStyleProps, i) => {
        const def = particleDefs[i];
        if (!def || !animatedStyleProps || !animatedStyleProps.y || !animatedStyleProps.rotate) {
            // If spring props or definitions are somehow not ready for this particle, skip rendering it.
            return null; 
        }

        return (
          <animated.span
            key={def.id} 
            className="particle-react-spring"
            style={{
              left: def.initialLeft,
              width: def.initialWidth,
              height: def.initialHeight,
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

