# Operational Rollups

## Idea

Project-wide state is maintained as compact node and project rollups so dashboards do not query every workspace independently.

## Core Concept

A node rollup includes objective, status, owners, current action, last progress, active runs and agents, descendants, work-item counts, spend, budget, head commit, checks, approvals, and integration readiness.

A project rollup includes active, queued, blocked, awaiting-review, and stale counts; pending decisions; active Sandboxes; project spend; and stop state.

## Intent

Rollups make the graph and mission control fast while retaining a traceable path to authoritative node details.

## Execution Concept

NodeAgent pushes meaningful state changes upward. ProjectAgent updates rollups and broadcasts patches. Stale indicators reflect missing progress or heartbeat, not assumed failure. Selecting any rollup opens its source node, run, work item, or event.

## Technical Aspects

Rollup events have event IDs, node sequences, source versions, and timestamps. ProjectAgent stores exact current rollups in SQLite. D1 stores a smaller project summary for cross-project discovery. Reconciliation replaces a rollup from a signed or authenticated NodeAgent operational snapshot.

Derived descendant counts and statuses are recomputed after graph mutations. Exact budgets update transactionally with reservations and usage.

## Invariants

- Rollups never contain full chat or secret content.
- Stale rollups are labeled, not silently treated as current.
- Exact operational controls use ProjectAgent state.

