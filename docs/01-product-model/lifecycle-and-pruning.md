# Lifecycle and Pruning

## Idea

The active graph must remain understandable as completed, failed, and exploratory nodes accumulate.

## Core Concept

Node lifecycle states cover provisioning, ready, active, blocked, awaiting review, changes requested, completed, failed, paused, cancelled, integrated, partially integrated, rejected, abandoned, archived, compacted, and deleted.

Pruning is the user-directed process of reconciling a node, stopping its execution, and removing it from the default active graph. It has four levels:

- **Collapse:** UI-only simplification.
- **Archive:** Read-only retention with compute stopped.
- **Compact:** Preserve outcomes and provenance while expiring bulky transient data.
- **Delete:** Permanent removal after dependency and retention checks.

## Intent

Users should be able to simplify the graph confidently without wondering whether useful descendant work, unmerged commits, or evidence will disappear.

## Execution Concept

Before pruning, the product shows a subtree impact report: active runs, unreviewed handoffs, unintegrated commits, decisions, artifacts, and descendants. Reconciliation proceeds bottom-up. The user chooses what to integrate, retain, reject, or discard.

After successful integration, policies may stop compute immediately, archive after a delay, compact later, and delete eligible transient resources after a recovery window. Human-created nodes default to more conservative retention than agent-created scratch nodes.

## Technical Aspects

ProjectAgent owns lifecycle transitions and subtree traversal. A `ReconcileWorkflow` freezes the handoff, obtains an integration lease, applies selected results, records the integration receipt, updates destination rollups, revokes source credentials, stops execution, and only then changes the source retention state.

Compaction writes a durable manifest of retained summaries, decisions, receipts, artifacts, and Git references before expiring data. Deletion uses tombstones so replayed events cannot resurrect resources accidentally.

## Invariants

- Stop, archive, compact, and delete are distinct operations.
- Pruning never precedes integration receipt persistence.
- Active descendants and unreviewed work are disclosed before subtree pruning.
- Archived nodes remain attributable and restorable within retention policy.

