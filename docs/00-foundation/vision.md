# Product Vision

## Idea

Build a collaborative operating environment where humans and agents organize complex work as a graph of isolated, inheritable workspaces. Users should be able to delegate objectives, execute alternatives in parallel, understand what is happening, selectively integrate useful results, and prune completed complexity without losing provenance.

## Core Concept

The durable unit is the workspace node, not the chat. Chat is one mode inside a node alongside objectives, plans, notes, summaries, decisions, code, terminals, previews, activity, and handoffs.

The project graph simultaneously represents:

- The decomposition of an objective.
- Human and agent delegation.
- Workspace and code lineage.
- Dependencies and integration targets.
- Review and feedback loops.
- The history of accepted and rejected approaches.

The graph is governed by a project-level control plane that makes parallel work legible and interruptible.

## Intent

The primary promise is: **run multiple agents in parallel without losing control of what they are doing, why they are doing it, what it costs, or what they changed.**

The product should reduce coordination overhead rather than create a new layer of agent management. It should make delegation feel lightweight, make progress evidence-based, and make stopping work safe.

## Execution Concept

A user begins with a root project objective. They or an agent create child nodes for meaningful subobjectives or alternative approaches. Each child inherits an explicit context and code baseline, then evolves independently. Humans and agents work within nodes, producing checkpoints and a structured work ledger.

When a node is ready, it submits a handoff to a chosen destination. The reviewer accepts code, knowledge, decisions, work items, and artifacts independently. Accepted work updates the destination node. The source can then remain active, be revised, be archived, or be compacted out of the active graph.

A mission-control surface shows active work, current actions, blockers, approvals, budgets, descendants, and safe stopping options across the project.

## Technical Aspects

The architecture aligns domain boundaries with stateful Cloudflare primitives. Project coordination belongs to a project-scoped Durable Object. Node collaboration belongs to a node-scoped Agent Durable Object. Code lineage belongs to per-node Artifacts repositories. Execution belongs to per-node Sandbox identities. Durable multi-step transitions belong to Workflows.

The architecture must preserve the vision if a particular storage or execution primitive changes. Domain identifiers and integration receipts therefore remain independent of Cloudflare resource identifiers.

## Invariants

- The graph represents real work boundaries, not decorative conversation branches.
- Delegated work is visible and attributable.
- A user can understand and stop active work at project, subtree, node, run, or process scope.
- Results move between nodes through explicit, reviewable handoffs.
- Active graph simplification does not erase accepted reasoning or lineage.

