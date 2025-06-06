
"use client";

import React from 'react';
import { useSprings, animated, config as springConfig } from '@react-spring/web';

const NUM_PARTICLES = 30;

const getRandom = (min: number, max: number): number => Math.random() * (max - min) + min;

export function ParticleBackground() {
  // Memoize static properties for each particle to avoid re-calculation on every render
  const staticParticleProps = React.useMemo(() => 
    Array.from({ length: NUM_PARTICLES }).map(() => {
      const size = getRandom(4, 16);
      return {
        left: `${getRandom(0, 100)}vw`,
        width: `${size}px`,
        height: `${size}px`, // Keep height same as width for circular shape
      };
    }), []);

  const springs = useSprings(
    NUM_PARTICLES,
    staticParticleProps.map((staticProps, i) => ({ // Pass index `i` if needed for unique delays/configs not derived from staticProps
      from: { 
        opacity: 0, 
        y: 20, // vh units for translateY
        rotate: 0, // degrees for rotate
      },
      to: { 
        opacity: [0, 1, 0.8, 0], // Fade in, mostly visible, then fade out
        y: -120, // vh units for translateY (move up and off-screen)
        rotate: getRandom(-450, 450), // Final rotation angle
      },
      config: { 
        duration: getRandom(10000, 20000), // Duration for one full animation cycle
        easing: (t: number) => t, // Linear easing for smooth, constant speed
      },
      delay: getRandom(0, 15000), // Initial random delay for a staggered start
      loop: { reset: true }, // Loop indefinitely, resetting to the `from` state each time
    }))
  );

  return (
    <div aria-hidden="true" className="animated-bg-particles">
      {springs.map((animatedStyleProps, i) => (
        <animated.span
          key={`particle-${i}`}
          className="particle-react-spring"
          style={{
            ...staticParticleProps[i], // Apply static styles (left, width, height)
            opacity: animatedStyleProps.opacity,
            transform: animatedStyleProps.y.to(
              (yValue) => `translateY(${yValue}vh) rotate(${animatedStyleProps.rotate.get()}deg)`
            ),
            // `rotate.get()` is used as rotate animates to a single value.
            // If rotate was an array like opacity, `.to()` would be used for it too.
          }}
        />
      ))}
    </div>
  );
}
