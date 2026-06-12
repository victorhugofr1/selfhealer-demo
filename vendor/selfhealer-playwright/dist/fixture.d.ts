import { expect } from "@playwright/test";
/**
 * Extends the default `page` fixture. After each test finishes, if it failed
 * (or timed out) with what looks like a selector failure, we grab the DOM at
 * that moment plus the failing selector and attach it under the well-known
 * name `self-healer-context`. The reporter collects these in `onEnd`.
 *
 * Two deliberate properties:
 *  1. Capture and transport are decoupled. Nothing is sent from inside the test;
 *     test code stays free of network calls and the package works on any CI.
 *  2. This fixture NEVER throws and NEVER changes test outcome. A self-healer
 *     that can break a customer's build is dead on arrival.
 *
 * Usage:
 *   import { test, expect } from '@selfhealer/playwright';
 *
 * If you already extend `test`, compose with Playwright's `mergeTests`
 * (see README) instead of importing this one directly.
 */
export declare const test: import("@playwright/test").TestType<import("@playwright/test").PlaywrightTestArgs & import("@playwright/test").PlaywrightTestOptions, import("@playwright/test").PlaywrightWorkerArgs & import("@playwright/test").PlaywrightWorkerOptions>;
export { expect };
