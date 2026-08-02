# Delivery Phases

## Idea

Deliver the system as complete vertical capabilities rather than disconnected infrastructure layers.

## Core Concept

Proposed phases:

1. **Durable graph:** Projects, nodes, typed containment, navigation, objectives, and persistence.
2. **Work and handoffs:** Work ledger, summaries, checkpoints, review loops, receipts, and archive.
3. **Versioned code:** Artifacts import, fork, local checkout, diffs, selected integration, and push events.
4. **Execution environments:** Sandbox activation, terminal, commands, checks, previews, and checkpoint backup.
5. **Agent orchestration:** Runs, models, tool loop, Workflows, approvals, and observable current actions.
6. **Subagents and mission control:** Visible delegation, hierarchical budgets, subtree controls, and “Needs you.”
7. **Graph hygiene and scale:** Compaction, retention, search, large-graph rendering, and analytics.
8. **Enterprise governance:** Advanced policy, audit export, data residency, identity providers, and administrative controls.

## Intent

Each phase should test a product assumption and produce usable behavior. Infrastructure should not outrun validated interaction design.

## Execution Concept

Use feature flags and internal dogfooding. Add failure injection before enabling automatic subagents or destructive retention. Track qualitative evidence about node granularity, review burden, and user control alongside product metrics.

## Technical Aspects

Introduce adapters for Artifacts, Sandbox, model providers, and telemetry. Maintain contract tests for domain workflows. Validate migrations, hibernation recovery, idempotency, token revocation, and cross-resource cleanup in each phase.

## Invariants

- Later automation builds on the same visible node and handoff model.
- No phase requires treating temporary Sandbox state as durable truth.

