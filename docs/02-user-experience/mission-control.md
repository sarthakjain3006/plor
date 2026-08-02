# Project Mission Control

## Idea

Mission control is the operational dashboard where users see what work is happening and decide when it should continue, pause, or stop.

## Core Concept

It answers:

1. What is happening now?
2. Why is it happening?
3. What needs me?
4. What can I stop safely?

It displays active and queued runs, current actions, blockers, approvals, pending integrations, elapsed time, budgets, active Sandboxes, descendants, and last progress.

## Intent

The dashboard is not primarily an analytics surface. It is a control room for human oversight. “Needs you” is more important than activity volume.

## Execution Concept

The top section summarizes project state. A prioritized “Needs you” queue presents approvals, conflicting requirements, budget thresholds, repeated failures, and ready handoffs. The active-work tree lists each actor's concrete action and next intended action.

Controls include pause all, prevent new agents, stop all, request reports, change budgets, and drill into a subtree. Stop dialogs explain affected runs, descendants, processes, uncommitted work, and allocated budget.

Every rollup drills down to evidence. “Three blocked nodes” opens a filtered graph; selecting a node opens the responsible work item and blocking event.

## Technical Aspects

Mission control reads an initial ProjectAgent snapshot and subscribes to versioned WebSocket events. The ProjectAgent stores exact operational rollups; Analytics Engine is not used for live control. Stale node heartbeats trigger targeted reconciliation with NodeAgents.

The client distinguishes requested state from confirmed state—for example, `stopping` from `cancelled`—and never claims a process stopped before receiving confirmation.

## Invariants

- Every active run shows objective, initiator, current action, elapsed time, usage, and stop semantics.
- Descendant effects are disclosed before hierarchical control operations.
- Stopping compute is never presented as deleting work.

