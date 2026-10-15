"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface IntroState {
  /** True once the loading screen has lifted; hero animations wait for this. */
  ready: boolean;
  setReady: (v: boolean) => void;
}

const IntroContext = createContext<IntroState>({ ready: true, setReady: () => {} });

export function IntroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const value = useMemo(() => ({ ready, setReady }), [ready]);
  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export const useIntro = () => useContext(IntroContext);
