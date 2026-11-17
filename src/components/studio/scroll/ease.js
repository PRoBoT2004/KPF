// Small math helpers for the scroll scenes (progress in, 0..1 out).
export const clamp01 = (v) => Math.min(1, Math.max(0, v));
/** progress of v through [a, b], clamped to 0..1 */
export const seg = (v, a, b) => clamp01((v - a) / (b - a));
export const easeOut = (t) => 1 - (1 - t) ** 3;
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
