"use strict";
/**
 * Best-effort parsing of the failing selector out of a Playwright error, plus a
 * heuristic for "is this a selector failure at all?".
 *
 * Important design note: this heuristic is intentionally *permissive*. A false
 * positive here just means the backend receives a context it will reject at the
 * validation gate (the new selector must resolve to exactly one element). The
 * client errs toward capturing; the backend is the strict authority. Never the
 * other way around.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSelector = extractSelector;
exports.isSelectorFailure = isSelectorFailure;
exports.lineFromStack = lineFromStack;
/** Pull the selector string the test was using out of the PW error text. */
function extractSelector(error) {
    const patterns = [
        // locator('...'), locator("..."), locator(`...`)
        /locator\((['"`])([\s\S]*?)\1\)/,
        // getByRole('button', { name: 'Log in' }) and friends — capture the args
        /(getBy[A-Za-z]+\([\s\S]*?\))/,
        // "waiting for locator('...')" / "waiting for '...'"
        /waiting for (?:locator\()?(['"`])([\s\S]*?)\1/,
    ];
    for (const re of patterns) {
        const m = error.match(re);
        if (m) {
            const captured = (m[2] ?? m[1])?.trim();
            if (captured)
                return captured;
        }
    }
    return undefined;
}
/**
 * Does this error look like a selector/locator failure (vs. a logic assertion,
 * a network timeout, or a genuine app bug)? Conservative-ish, but remember the
 * backend gate is the real safety net.
 */
function isSelectorFailure(error) {
    return /resolved to 0 elements|strict mode violation|waiting for (?:selector|locator)|locator\.[a-zA-Z]+:|element is not (?:visible|attached|enabled|stable)|Timeout .*exceeded/i.test(error);
}
/**
 * Find the 1-based line of the failing call inside the *test file* by scanning
 * the error stack. `TestInfoError` has no `location` field, so the stack is the
 * reliable source. Used by the backend to scope the selector replacement to the
 * exact line (so an identical selector elsewhere in the file is never touched).
 */
function lineFromStack(stack, testFile) {
    if (!stack)
        return undefined;
    const escaped = testFile.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const m = stack.match(new RegExp(escaped + ":(\\d+):\\d+"));
    return m ? parseInt(m[1], 10) : undefined;
}
