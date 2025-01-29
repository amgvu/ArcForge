"use client"

import { TextEffect } from '@/components/ui/Animations/text-effect';
import { TextLoop } from '@/components/ui/Animations/text-loop';
import { useState, useEffect } from 'react';

export default function Home() {
  const [showTextLoop, setShowTextLoop] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTextLoop(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] bg-neutral-950 text-neutral-100 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-mono)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <h1 className="font-bold text-9xl">
          <TextEffect delay={0.5}>
            PROJECT ARCS
          </TextEffect>
        </h1>

        <div className="text-center text-4xl space-y-4">
          <TextEffect delay={1.5}>
          Making names and roles management in your Discord server fun, driven by AI.
          </TextEffect>
          
          <div className={`transition-opacity duration-1000 ${showTextLoop ? 'opacity-100' : 'opacity-0'}`}>
            <TextLoop
              className='overflow-y-clip text-3xl'
              transition={{
                type: 'spring',
                stiffness: 900,
                damping: 80,
                mass: 10,
              }}
              variants={{
                initial: {
                  y: 20,
                  rotateX: 90,
                  opacity: 0,
                  filter: 'blur(4px)',
                },
                animate: {
                  y: 0,
                  rotateX: 0,
                  opacity: 1,
                  filter: 'blur(0px)',
                },
                exit: {
                  y: -20,
                  rotateX: -90,
                  opacity: 0,
                  filter: 'blur(4px)',
                },
              }}
            >
              <span>Marvel</span>
              <span>LOTR</span>
              <span>Pokemon</span>
              <span>Fast Food</span>
              <span>Rapper</span>
              <span>Actors</span>
              <span>Sopranos</span>
              <span>League</span>
              <span>Severance</span>
              <span>DC</span>
              <span>NBA</span>
            </TextLoop>
            <h3 className='inline-flex whitespace-pre-wrap text-3xl'>
              {' '} arc?
            </h3>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <TextEffect delay={5}>
          Coming soon...
        </TextEffect>
      </footer>
    </div>
  );
}
