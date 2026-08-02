# Product Principles

## Idea

The product needs a small set of durable principles to resolve inevitable tradeoffs between autonomy, visibility, simplicity, and control.

## Core Concept

The governing principles are:

1. **The node is the durable unit.** Conversation, code, execution, and knowledge attach to it.
2. **Delegation creates visible work.** Subagents do not disappear into an opaque transcript.
3. **Progress requires evidence.** Claims are connected to commits, checks, decisions, or artifacts.
4. **Control is hierarchical.** Policies and stopping operations propagate deliberately through descendants.
5. **Boundaries are explicit.** Context, permissions, secrets, budgets, and outputs cross nodes through named operations.
6. **Execution is disposable; results are durable.** A stopped container must not be the only home of important work.
7. **Prune complexity, preserve provenance.** Archive and compact before deleting.
8. **The user manages exceptions.** The system should automate routine coordination and surface decisions that genuinely need judgment.
9. **Different relationships use different edges.** Organization, code lineage, delegation, dependency, and integration are not one generic parent relationship.
10. **Honest state beats artificial certainty.** Prefer explicit criteria and blockers to an invented completion percentage.

## Intent

These principles keep the interface understandable as agents gain autonomy. They also protect users from silent delegation, invisible spending, ambiguous stopping behavior, and unverifiable completion.

## Execution Concept

Feature proposals should state which principles they advance and which they pressure. For example, automatic subagent creation advances delegation speed but pressures visibility, budget inheritance, and graph hygiene. It is acceptable only if the resulting node is visible, bounded, and controllable.

## Technical Aspects

The principles imply durable IDs, typed actors, typed graph edges, append-only events, idempotent cross-resource workflows, scoped credentials, immutable integration receipts, and separate authorities for operational state and analytical telemetry.

## Invariants

- No model-generated statement alone can mutate authoritative permissions or integration history.
- No background run may escape its ancestor budget or delegation policy.
- No destructive graph operation may conceal unreviewed descendant work.

