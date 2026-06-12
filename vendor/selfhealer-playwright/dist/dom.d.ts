/**
 * DOM cleaning for cost control.
 *
 * At €99/mo, every heal must cost cents, not euros. Sending raw `page.content()`
 * (often several MB) to an LLM is both expensive and noisy. We strip everything
 * that is never needed to locate an element (scripts, styles, comments) and cap
 * the size so a single heal stays in a predictable token budget.
 */
/** ~15k tokens worth of characters. Tune against your model's pricing. */
export declare const MAX_DOM_CHARS = 60000;
export declare function cleanDom(html: string, maxChars?: number): string;
