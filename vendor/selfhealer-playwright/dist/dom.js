"use strict";
/**
 * DOM cleaning for cost control.
 *
 * At €99/mo, every heal must cost cents, not euros. Sending raw `page.content()`
 * (often several MB) to an LLM is both expensive and noisy. We strip everything
 * that is never needed to locate an element (scripts, styles, comments) and cap
 * the size so a single heal stays in a predictable token budget.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_DOM_CHARS = void 0;
exports.cleanDom = cleanDom;
/** ~15k tokens worth of characters. Tune against your model's pricing. */
exports.MAX_DOM_CHARS = 60_000;
function cleanDom(html, maxChars = exports.MAX_DOM_CHARS) {
    let out = html
        // Bodies of script/style/noscript are pure noise for selector resolution.
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "")
        // HTML comments.
        .replace(/<!--[\s\S]*?-->/g, "")
        // Collapse runs of whitespace introduced by the strips above.
        .replace(/\s+/g, " ")
        .trim();
    // TODO(v2): instead of a head-truncation, extract the subtree around plausible
    // matches for `oldSelector` so deep elements survive the cap. Naive slice is
    // fine for the MVP (login/checkout pages fit comfortably).
    if (out.length > maxChars) {
        out = out.slice(0, maxChars);
    }
    return out;
}
