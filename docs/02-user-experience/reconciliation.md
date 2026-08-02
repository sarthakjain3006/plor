# Reconciliation Experience

## Idea

Reconciliation lets a user choose which parts of completed node work should update a destination node before the source is pruned.

## Core Concept

The review is divided into independently selectable categories: code, findings, decisions, notes, work items, evidence, and artifacts. The system previews destination effects and creates an integration receipt.

## Intent

Users should not face an all-or-nothing merge. A valuable investigation can have bad code; a rejected approach can contain an important decision; an incomplete child can still return useful artifacts.

## Execution Concept

The review screen shows source objective, completion criteria, handoff version, source checkpoint, and destination freshness. Reviewers can:

- Accept all, select commits, files, or hunks, or discard code.
- Import findings as notes or decisions.
- Convert unfinished work into destination work items.
- Link or copy artifacts.
- Request changes with itemized feedback.
- Open a conflict-resolution workspace.
- Integrate and archive in one operation.

After checks run, the screen shows destination before and after commits, applied items, rejected items, and retention options.

## Technical Aspects

A reconciliation request references stable handoff item IDs and expected destination commit. ProjectAgent acquires an integration lease. ReconcileWorkflow activates the destination Sandbox, fetches the source Artifact, applies selections, runs required checks, pushes the destination, updates destination NodeAgent, records a receipt, and then performs the selected source retention action.

If the destination changed, the workflow recalculates the preview or opens conflict resolution rather than applying a stale patch.

## Invariants

- Integration is never performed from an unversioned handoff draft.
- The receipt records destination state before and after integration.
- Pruning waits for receipt persistence.

