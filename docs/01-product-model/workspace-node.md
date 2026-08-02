# Workspace Node

## Idea

A node is a self-contained collaborative workspace created around a meaningful objective. It is the durable unit of thought, execution, delegation, and review.

## Core Concept

A node contains:

- Identity, title, objective, constraints, and completion criteria.
- Human members, assigned agents, roles, and permissions.
- Chat, notes, decisions, summary, plan, activity, and handoffs.
- Work items, runs, actions, checkpoints, and approvals.
- One durable Artifact repository for versioned code.
- One stable Sandbox identity for on-demand execution.
- Budget, runtime policy, secret scope, and retention policy.
- Typed relationships to parent, origin, dependencies, and integration destination.

A node is not a single chat thread, model instance, container lifetime, or Git branch. Those are resources or modes attached to it.

## Intent

Users should be able to leave and return to a node without reconstructing its purpose or environment. A node should answer what it is trying to accomplish, who is working, what is happening, what changed, what remains, and what it can return.

Nodes should be created for meaningful objectives, alternative approaches, security boundaries, or execution boundaries—not for every message or tool call.

## Execution Concept

Creating a node requires an objective and a parent or root project. Optional advanced settings define code inheritance, assignees, budget, permissions, and completion criteria. A newly created node is visible immediately in a provisioning state.

Inside the node, collaborators switch between modes without leaving the workspace context. Work progresses through a structured ledger. The node can submit one or more handoff versions, receive feedback, continue work, and eventually be integrated, archived, compacted, or deleted.

## Technical Aspects

The domain record uses an immutable `nodeId`. `NodeAgent(nodeId)`, `Artifact(nodeId)`, and `Sandbox(nodeId)` are deterministic resource mappings. The ProjectAgent owns graph membership and rollup state; the NodeAgent owns detailed workspace state.

Suggested durable metadata:

```ts
type Node = {
  id: string;
  projectId: string;
  title: string;
  objective: string;
  status: NodeStatus;
  sourceNodeId?: string;
  sourceCommit?: string;
  integrationTargetId?: string;
  createdBy: ActorRef;
  createdAt: string;
  version: number;
};
```

## Invariants

- A node has exactly one project.
- Code origin is immutable even when visual organization changes.
- Important node state survives Sandbox destruction and Agent hibernation.
- A node may coordinate multiple humans and multiple agent runs.

