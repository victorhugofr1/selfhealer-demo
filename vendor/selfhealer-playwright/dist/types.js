"use strict";
/**
 * Shared types for the Self-Healer client package.
 *
 * A `HealContext` is everything the backend needs to (1) understand what broke
 * and (2) generate + validate a replacement selector before opening a PR.
 * It is captured by the fixture and shipped in a batch by the reporter.
 */
Object.defineProperty(exports, "__esModule", { value: true });
