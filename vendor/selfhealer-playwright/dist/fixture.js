"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expect = exports.test = void 0;
const test_1 = require("@playwright/test");
Object.defineProperty(exports, "expect", { enumerable: true, get: function () { return test_1.expect; } });
const dom_1 = require("./dom");
const selector_1 = require("./selector");
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
exports.test = test_1.test.extend({
    page: async ({ page }, use, testInfo) => {
        await use(page);
        // Capture on both 'failed' and 'timedOut': a locator that waits out the
        // test timeout surfaces as 'timedOut', not 'failed'.
        const isFailed = testInfo.status === "failed" || testInfo.status === "timedOut";
        const err = testInfo.errors?.[0];
        if (!isFailed || !err?.message)
            return;
        if (!(0, selector_1.isSelectorFailure)(err.message))
            return;
        try {
            const context = {
                testTitle: testInfo.titlePath.join(" › "),
                testFile: testInfo.file,
                line: (0, selector_1.lineFromStack)(err.stack, testInfo.file),
                oldSelector: (0, selector_1.extractSelector)(err.message),
                error: err.message,
                url: page.url(),
                dom: (0, dom_1.cleanDom)(await page.content()),
                project: testInfo.project.name,
                capturedAt: new Date().toISOString(),
            };
            await testInfo.attach("self-healer-context", {
                contentType: "application/json",
                body: JSON.stringify(context),
            });
        }
        catch {
            // Page may already be closed (e.g. an afterEach navigated/closed it).
            // Capturing is best-effort by design — swallow and move on.
        }
    },
});
