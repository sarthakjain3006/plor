# Vocabulary

## Idea

A shared vocabulary prevents product discussions from conflating workspace coordination, model execution, Git history, and visual graph relationships.

## Core Concept

- **Organization:** Administrative boundary containing users and projects.
- **Project:** Top-level collaborative objective and control boundary.
- **ProjectAgent:** Durable project coordinator that owns the graph, rollups, budgets, and project controls.
- **Node:** Durable workspace associated with a meaningful objective or execution boundary.
- **NodeAgent:** Durable server-side coordinator for a node. It is not the same as a model run.
- **Actor:** Human, agent, service, or system identity responsible for an action.
- **Agent run:** One bounded attempt by a model-driven worker to advance a work item.
- **Subagent:** An agent run delegated by another run, normally represented by a visible child node.
- **Work item:** Trackable unit in a node plan.
- **Action:** Concrete step within a run, such as a model call, command, edit, or approval wait.
- **Checkpoint:** Durable evidence of progress at a point in time.
- **Handoff:** Versioned proposal to transfer selected outcomes from one node to another.
- **Integration receipt:** Immutable record of what a destination accepted from a handoff.
- **Artifact repository:** Cloudflare Artifacts Git repository holding a node's durable code history.
- **Sandbox:** On-demand isolated Linux environment used to execute node work.
- **Prune:** Remove a node from the active graph after reconciling or explicitly discarding its work.
- **Archive:** Preserve a node read-only while stopping compute and hiding it from the default active graph.
- **Compact:** Retain important outcomes and provenance while expiring bulky transient history.
- **Delete:** Permanently remove eligible retained resources after policy and dependency checks.
- **Lineage:** Immutable record of where a node or repository fork originated.
- **Containment:** Organizational relationship used to navigate project work.
- **Return edge:** A submission or integration relationship from a source node to a destination node.

## Intent

These terms should appear consistently in the user interface, schema, events, and documentation. User-facing labels may be friendlier, but their underlying semantics must remain stable.

## Execution Concept

When adding a domain concept, define it here, identify its authority, and distinguish it from adjacent concepts. Avoid using “agent” when the intended meaning is node, run, model, or actor.

## Technical Aspects

Each durable concept should receive an immutable identifier. Relationships should reference identifiers rather than names. External resource IDs, such as an Artifact repository ID or Workflow instance ID, are mappings attached to domain records rather than replacements for domain identity.

