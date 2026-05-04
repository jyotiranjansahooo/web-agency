'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type TransitionContextType = {
  isAnimating: boolean;
  setAnimating: (val: boolean) => void;
};

const TransitionContext = createContext<TransitionContextType | null>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isAnimating, setAnimating] = useState(false);

  return (
    <TransitionContext.Provider value={{ isAnimating, setAnimating }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error('useTransition must be used inside TransitionProvider');
  }
  return ctx;
}
