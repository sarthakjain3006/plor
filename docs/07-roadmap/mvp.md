# Minimum Viable Product

## Idea

The MVP proves that workspace nodes and reconciliation are more useful than linear chat for coordinating parallel coding work.

## Core Concept

The MVP includes:

- Projects and authenticated membership.
- Persistent nodes with objectives and completion criteria.
- Containment graph and node navigation.
- Chat, notes, summary, work, activity, and handoff modes.
- Work items, runs entered by the system or user, and checkpoints.
- Agent-generated, human-editable operation drawings for setup and integration.
- Parallel and reciprocal typed edges with visible status.
- Immutable drawing runs with streamed Sandbox evidence and explicit final approval.
- One Artifact repository per coding node.
- Node forking from a parent repository.
- Structured handoff review and integration receipts.
- Archive and restore after reconciliation.
- Basic ProjectAgent mission control.

It may initially use deterministic context generation and simulated Sandbox execution while establishing durable semantics and the Pi adapter contract.

## Intent

The MVP should validate whether users understand nodes, create them at useful granularity, and trust selective parent updates and pruning.

## Execution Concept

A user imports a repository, creates a child objective, and asks the agent to draw a setup or integration approach. The user modifies the drawing, runs immutable revisions in a Sandbox, reviews attached evidence, approves one candidate, and archives the reconciled child. Mission control shows active and review-ready work.

## Technical Aspects

Implement D1 identity and project discovery, ProjectAgent graph state, NodeAgent workspace state, Artifacts integration, and a constrained ReconcileWorkflow. Delay full browser terminal, arbitrary subagent spawning, advanced Analytics Engine dashboards, and aggressive compaction until the core loop is reliable.

## Success Criteria

- Users can recover project state after reload and Agent hibernation.
- Node creation and retry do not duplicate resources.
- A handoff can partially update a parent with an auditable receipt.
- Archiving cannot lose unreviewed work silently.
- Users prefer the graph for at least one real parallel task.
