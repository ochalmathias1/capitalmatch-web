---
name: capitalmatch_audit_apr2026
description: Code audit findings for both capitalmatch-agents and capitalmatch-web repos
type: project
---

Comprehensive code audit completed 2026-04-06 across both repos.

**Why:** Regular audit to catch stale references after refactors and ensure zero OpenAI/email_whitelist leakage.

**How to apply:** Re-run these checks after any major refactor:

## capitalmatch-agents (bugs fixed)
- test-e2e.ts had 5 references to deleted `email_whitelist` table (replaced with lenders/brokers/isos)
- test-e2e.ts had wrong property name `bodyPreview` vs `body` in SecurityCheckInput mock
- bankStatementAnalysis.ts had stale "GPT" log message (uses Claude Haiku)
- Stale nested `capitalmatch-agents/` subdirectory with old pre-refactor files removed
- tsconfig.json updated to explicitly include `pipeline/**/*.ts`
- pipelineRunner.DEPRECATED.ts still references OPENAI_API_KEY (acceptable — file is deprecated, marked for deletion)

## capitalmatch-web (clean)
- All .ts/.tsx files compile cleanly with `npx tsc --noEmit`
- No bugs found

## Verification checklist (all passed)
- Zero OpenAI API references in active code
- Zero email_whitelist references in active code
- All FROM addresses use subs@capitalmatchfunding.com
- Zero auto-replies to merchants (only initial confirmation in intake.ts)
- Bank analysis data NOT included in lender emails (submission.ts)
- Gmail poller runs successfully (201 messages in each inbox, all read)
