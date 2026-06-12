"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
class SelfHealerReporter {
    constructor(opts = {}) {
        this.contexts = [];
        this.apiKey = opts.apiKey ?? process.env.SELFHEALER_API_KEY ?? "";
        this.endpoint =
            opts.endpoint ??
                process.env.SELFHEALER_ENDPOINT ??
                "https://api.selfhealer.dev/heal/batch";
        this.maxContexts = opts.maxContexts ?? 50;
    }
    onTestEnd(_test, result) {
        for (const att of result.attachments) {
            if (att.name !== "self-healer-context" || !att.body)
                continue;
            if (this.contexts.length >= this.maxContexts)
                break;
            try {
                this.contexts.push(JSON.parse(att.body.toString("utf8")));
            }
            catch {
                // Malformed attachment — skip silently.
            }
        }
    }
    async onEnd(_result) {
        if (this.contexts.length === 0)
            return;
        if (!this.apiKey) {
            console.warn("[self-healer] no SELFHEALER_API_KEY set — skipping heal upload.");
            return;
        }
        const payload = {
            repo: process.env.GITHUB_REPOSITORY,
            sha: process.env.GITHUB_SHA,
            branch: process.env.GITHUB_REF_NAME,
            runId: process.env.GITHUB_RUN_ID,
            contexts: this.contexts,
        };
        try {
            const res = await fetch(this.endpoint, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                console.warn(`[self-healer] upload failed: ${res.status} ${res.statusText}`);
                return;
            }
            const data = (await res.json().catch(() => ({})));
            console.log(`[self-healer] sent ${this.contexts.length} context(s); ` +
                `${data.prsOpened ?? 0} PR(s) queued.`);
        }
        catch (e) {
            console.warn("[self-healer] upload error:", e.message);
        }
    }
}
exports.default = SelfHealerReporter;
