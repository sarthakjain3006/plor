# Product Model

## Idea

The product model defines the durable concepts users create, navigate, operate, and reconcile.

## Core Concept

Projects contain workspace nodes connected by typed edges. Nodes contain objectives, modes, collaborators, work ledgers, runs, and outcomes. Work is delegated into nodes and returned through handoffs.

Documents:

- [Workspace node](./workspace-node.md)
- [Workspace modes](./workspace-modes.md)
- [Graph and edges](./graph-and-edges.md)
- [Actors and collaboration](./actors-and-collaboration.md)
- [Work ledger](./work-ledger.md)
- [Handoffs and feedback loops](./handoffs-and-loops.md)
- [Lifecycle and pruning](./lifecycle-and-pruning.md)

## Intent

This model makes the graph meaningful enough to support planning and orchestration without turning the product into a rigid project-management system.

## Execution Concept

Users interact with simple product objects—projects, nodes, work items, runs, handoffs, and integrations. Advanced relationships remain available when needed but do not obstruct basic delegation.

## Technical Aspects

The model is persisted across ProjectAgent SQLite, NodeAgent SQLite, D1 indexes, Artifacts repositories, and external execution resources. [Data ownership](../03-system-architecture/data-ownership.md) defines the authority for each record.

