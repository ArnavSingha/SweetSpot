'use client';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
      <div className="absolute inset-0 h-full w-full bg-background">
        <div
          className="absolute bottom-[-20vh] left-[-20vw] h-[50vh] w-[50vw] rounded-full bg-primary/20 opacity-50 blur-3xl"
          style={{ animation: 'blob-1 25s infinite' }}
        ></div>
        <div
          className="absolute right-[-20vw] top-[-20vh] h-[40vh] w-[40vw] rounded-full bg-accent/20 opacity-50 blur-3xl"
          style={{ animation: 'blob-2 20s infinite' }}
        ></div>
      </div>
    </div>
  );
}
