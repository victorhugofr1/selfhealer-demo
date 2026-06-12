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
/** Pull the selector string the test was using out of the PW error text. */
export declare function extractSelector(error: string): string | undefined;
/**
 * Does this error look like a selector/locator failure (vs. a logic assertion,
 * a network timeout, or a genuine app bug)? Conservative-ish, but remember the
 * backend gate is the real safety net.
 */
export declare function isSelectorFailure(error: string): boolean;
/**
 * Find the 1-based line of the failing call inside the *test file* by scanning
 * the error stack. `TestInfoError` has no `location` field, so the stack is the
 * reliable source. Used by the backend to scope the selector replacement to the
 * exact line (so an identical selector elsewhere in the file is never touched).
 */
export declare function lineFromStack(stack: string | undefined, testFile: string): number | undefined;
