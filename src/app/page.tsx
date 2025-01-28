import { TextEffect } from '@/components/ui/Animations/text-effect';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] bg-neutral-950 text-white items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-mono)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
          <h1 className="font-bold text-8xl">
            <TextEffect>
            PROJECT ARCS
            </TextEffect>
            </h1>

        <div className="text-center text-2xl space-y-4">
          <TextEffect delay={1}>
            The next generation of names and roles management in your Discord server, driven by AI.
            </TextEffect>
            <TextEffect className="font-bold" delay={3.5}>
            It&apos;s fun :)
            </TextEffect>
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
