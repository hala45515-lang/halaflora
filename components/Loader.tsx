"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogoDraw } from "./LogoDraw";
import { useIntro } from "./IntroProvider";
import { useLockScroll } from "@/lib/scroll-lock";

/** Cream curtain: the logo draws itself, the tagline fades in, then the curtain lifts. */
export function Loader() {
  const { setReady } = useIntro();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(false), reduce ? 700 : 3600);
    return () => window.clearTimeout(t);
  }, [reduce]);

  useLockScroll(visible);

  return (
    <AnimatePresence onExitComplete={() => setReady(true)}>
      {visible && (
        <motion.div
          id="halaflora-loader"
          role="status"
          aria-label="Loading Halaflora"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ivory text-burgundy"
          exit={{ y: "-100%", borderBottomLeftRadius: "50% 12vh", borderBottomRightRadius: "50% 12vh" }}
          transition={{ duration: reduce ? 0.3 : 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <LogoDraw className="w-[min(78vw,520px)]" />
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduce ? 0 : 2.3, duration: 0.9 }}
            className="mt-6 font-serif text-lg italic tracking-wide text-rose sm:text-xl"
          >
            The Sweetness of Every Bloom
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
