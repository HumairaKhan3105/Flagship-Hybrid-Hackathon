import React from 'react';
import { Compass, ArrowLeft } from 'lucide-react';

interface ReturnToAnveshamPillProps {
  label?: string;
  className?: string;
}

export function ReturnToAnveshamPill({
  label = 'Return to Anvesham',
  className = '',
}: ReturnToAnveshamPillProps) {
  return (
    <a
      href="/"
      aria-label="Return to Anvesham landing page"
      className={`fixed top-3 left-3 sm:top-4 sm:left-4 z-[9999] inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-full bg-stone-950/85 hover:bg-stone-900 text-amber-200 hover:text-white backdrop-blur-md border border-amber-500/40 text-[0.68rem] sm:text-xs font-serif tracking-wider shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-amber-400 hover:scale-105 active:scale-95 group ${className}`}
    >
      <ArrowLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-0.5 transition-transform duration-200" />
      <Compass className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-45 transition-transform duration-300" />
      <span className="font-medium">{label}</span>
    </a>
  );
}
