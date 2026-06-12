/**
 * Shared types for the Self-Healer client package.
 *
 * A `HealContext` is everything the backend needs to (1) understand what broke
 * and (2) generate + validate a replacement selector before opening a PR.
 * It is captured by the fixture and shipped in a batch by the reporter.
 */
export interface HealContext {
    /** Full test title path, e.g. "auth.spec.ts › login › rejects bad password". */
    testTitle: string;
    /** Absolute path to the test file (the file the PR will edit). */
    testFile: string;
    /**
     * 1-based line in the test file where the failing locator lives.
     * Best-effort, taken from the Playwright error location. Used by the backend
     * to scope the string replacement so we never touch an identical selector
     * elsewhere in the file.
     */
    line?: number;
    /**
     * The selector string the test was trying to use, parsed from the PW error.
     * This is the single most important "intent" signal for the LLM:
     * a broken `[data-testid="submit"]` tells us *what* the test wanted.
     */
    oldSelector?: string;
    /** Raw Playwright error message (the full "Call log" included). */
    error: string;
    /** URL at the moment of failure. */
    url: string;
    /** Cleaned + truncated DOM at the moment of failure (scripts/styles stripped). */
    dom: string;
    /** Playwright project name, e.g. "chromium". */
    project?: string;
    /** ISO-8601 timestamp of capture. */
    capturedAt: string;
}
/**
 * The payload POSTed by the reporter at the end of a run.
 * Repo/sha/branch are injected from CI env vars (GitHub Actions by default)
 * so the backend knows which repo + base branch to open the PR against.
 */
export interface HealBatchPayload {
    /** "owner/name" — from GITHUB_REPOSITORY on GitHub Actions. */
    repo?: string;
    /** Commit SHA the tests ran against. */
    sha?: string;
    /** Branch name — the PR base. */
    branch?: string;
    /** CI run id, for traceability / dashboard linking. */
    runId?: string;
    /** One entry per failed test that looked like a selector failure. */
    contexts: HealContext[];
}
/** Shape the backend returns. Surfaced in CI logs by the reporter. */
export interface HealBatchResponse {
    received: number;
    prsOpened?: number;
    /** Optional per-context outcome for richer logging. */
    results?: Array<{
        testTitle: string;
        status: "pr_opened" | "rejected_by_validation" | "low_confidence" | "error";
        prUrl?: string;
    }>;
}
