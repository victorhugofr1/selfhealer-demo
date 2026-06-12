import type { Reporter, TestCase, TestResult, FullResult } from "@playwright/test/reporter";
export interface SelfHealerReporterOptions {
    /** Defaults to process.env.SELFHEALER_API_KEY. */
    apiKey?: string;
    /** Defaults to process.env.SELFHEALER_ENDPOINT or the hosted endpoint. */
    endpoint?: string;
    /** Hard cap on contexts per run, to bound cost on a catastrophic break. */
    maxContexts?: number;
}
/**
 * Playwright reporter that gathers `self-healer-context` attachments produced by
 * the fixture and POSTs them to the Self-Healer backend once the run ends.
 *
 * Like the fixture, this reporter is non-fatal by contract: every failure path
 * is a `console.warn`, never a throw. It must never be the reason a CI run goes
 * red.
 *
 * Register in playwright.config.ts:
 *   reporter: [
 *     ['list'],
 *     ['@selfhealer/playwright/reporter', { apiKey: process.env.SELFHEALER_API_KEY }],
 *   ]
 */
export default class SelfHealerReporter implements Reporter {
    private contexts;
    private readonly apiKey;
    private readonly endpoint;
    private readonly maxContexts;
    constructor(opts?: SelfHealerReporterOptions);
    onTestEnd(_test: TestCase, result: TestResult): void;
    onEnd(_result: FullResult): Promise<void>;
}
