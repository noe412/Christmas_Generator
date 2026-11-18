/**
 * Central application configuration.
 * All tunable values live here so behaviour can be adjusted without touching UI code.
 */
export const APP_CONFIG = {
  /** localStorage key for the persisted participant list (bump the suffix on breaking changes). */
  storageKey: "christmas_gift_generator_names_v1",
  /** Interval between name swaps during the draw animation (ms). */
  spinStepMs: 120,
  /** Total duration of the draw animation (ms). */
  spinTotalMs: 6000,
  /** Slideshow auto-advance interval (ms). */
  slideIntervalMs: 4000,
  /** Number of animated snowflakes. */
  snowflakeCount: 40,
  /** Hard limits protecting the browser from oversized input. */
  limits: {
    maxNameLength: 60,
    maxNames: 500,
    maxImportBytes: 256 * 1024,
    maxImageBytes: 15 * 1024 * 1024,
    maxImages: 100,
  },
} as const;
