/**
 * Round to 2 decimals. Math.sin/cos/sqrt can differ in the last digits between Node
 * and the browser, so every computed SVG coordinate goes through this to keep
 * server and client markup identical (no hydration mismatch).
 */
export const r2 = (n: number): number => Math.round(n * 100) / 100 || 0;
