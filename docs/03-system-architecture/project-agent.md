# ProjectAgent

## Idea

The ProjectAgent is the strongly consistent control plane for one project's graph and current operational state.

## Core Concept

It owns nodes, typed edges, project membership projections, node rollups, budgets, approvals, handoff routing, integration leases, stop requests, and the mission-control event stream.

It does not own detailed node chat, code bytes, Sandbox filesystem state, or long-term analytical aggregates.

## Intent

One project authority avoids querying every NodeAgent for tree operations and provides a single place to enforce graph invariants, hierarchical policy, and exact live budgets.

## Execution Concept

Clients connect to ProjectAgent when viewing mission control or the graph. NodeAgents report versioned operational events. ProjectAgent applies them idempotently, updates rollups, and broadcasts project patches.

Callable operations include create child, change grouping, add dependency, allocate budget, initiate stop, review handoff, acquire integration lease, archive, restore, and request targeted reconciliation.

## Technical Aspects

Suggested tables:

```text
project_state
nodes
edges
node_rollups
members
budget_allocations
handoffs
integration_receipts
integration_leases
stop_requests
project_events
processed_events
```

Mutations execute within Durable Object SQLite transactions where local. RPC methods accept actor context, expected graph version, and idempotency key. Hibernating WebSockets carry minimal connection identity attachments. Larger connection authorization is reloaded from storage.

## Invariants

- Only ProjectAgent mutates authoritative graph structure.
- Project budget cannot be exceeded through descendant delegation.
- Integration leases are exclusive per destination repository mutation.

