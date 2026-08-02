# Event Model

## Idea

Structured events connect independently owned resources and make activity, rollups, audit history, recovery, and analytics derive from the same observable work.

## Core Concept

An event envelope contains:

```ts
type DomainEvent = {
  eventId: string;
  type: string;
  projectId: string;
  nodeId?: string;
  runId?: string;
  actor: ActorRef;
  sequence?: number;
  occurredAt: string;
  causationId?: string;
  correlationId?: string;
  schemaVersion: number;
  payload: unknown;
};
```

Event families include graph, node, work item, run, action, Sandbox, repository, approval, handoff, integration, budget, and retention events.

## Intent

Events should explain what happened without requiring replay of raw model text or command logs. They support accountability and rebuilding projections while avoiding event-sourcing every byte of application state.

## Execution Concept

NodeAgent stores detailed local events, emits compact operational events to ProjectAgent, and emits telemetry events asynchronously. ProjectAgent broadcasts user-relevant patches. Activity views render normalized events with links to evidence.

## Technical Aspects

Important state transitions use a transactional outbox. Queue consumers assume at-least-once delivery and deduplicate by `eventId`. Per-node sequences identify gaps; source state versions support reconciliation. Schemas are versioned and consumers tolerate additive fields.

Event payloads exclude credentials, raw secrets, and sensitive command environment values. Bulk logs live in R2 with access-controlled references.

## Invariants

- Events are immutable.
- Reprocessing an event is idempotent.
- Event timestamps do not replace source ordering fields.
- Analytics emission cannot block authoritative state changes.

