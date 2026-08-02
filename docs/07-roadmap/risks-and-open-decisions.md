# Risks and Open Decisions

## Idea

The largest threats are not graph rendering or model access; they are coordination overhead, ambiguous semantics, unreliable reconciliation, and loss of user trust.

## Core Concept

Primary risks:

- Node proliferation makes the graph exhausting.
- Users spend more time managing agents than benefiting from them.
- Summaries become stale or confidently wrong.
- Siblings duplicate work or create conflicting changes.
- Parent and child code diverge beyond easy integration.
- Subagents escape budget or permission intent.
- Sandbox startup and restore latency interrupt flow.
- Multi-resource failures produce partial or orphaned state.
- Artifact beta limitations affect durability or availability.
- Compaction or deletion removes information later needed for audit.

## Intent

Risks should remain visible and testable rather than buried as implementation details. Open decisions should be settled with user evidence and failure testing.

## Execution Concept

Mitigations include node-creation guidance, automatic clustering, event-derived summaries with freshness, sibling context checks, integration previews, hierarchical allocation, warm backups, idempotent Workflows, repository mirroring, and conservative retention defaults.

## Technical Aspects

Open decisions include:

- Whether ProjectAgent or D1 is the long-term authority for very large project graphs.
- Maximum practical nodes and connections per ProjectAgent.
- When a helper run must become a visible child node.
- Default branch policy for multiple collaborators in one node.
- Artifact mirroring and export strategy during beta.
- Summary generation cadence and human correction model.
- Exact semantics of moving nodes in the organizational graph.
- Which data survives compacted-node retention tiers.
- How destination integration leases interact with continued local pushes.
- Whether complex reconciliation always creates a temporary integration node.

Run architecture decision records for settled choices and link them from the affected documents.

## Invariants

- Unsettled decisions are not silently encoded as irreversible schema assumptions.
- High-risk destructive behavior defaults to recoverable operations.

