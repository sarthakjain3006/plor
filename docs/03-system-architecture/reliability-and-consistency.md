# Reliability and Consistency

## Idea

The system spans several independently durable services, so reliable behavior depends on explicit state machines and recovery rather than assumed distributed transactions.

## Core Concept

Local mutations are transactional within their authority. Cross-resource operations use Workflows with idempotent steps, operation records, retries, compensating actions, and reconciliation. User-visible transitional states are first-class.

## Intent

Failures should leave inspectable, recoverable work rather than duplicate nodes, lost commits, phantom running agents, or silently partial integrations.

## Execution Concept

Provisioning, integration, stop, restore, and pruning operations expose progress and failure state. Users can retry safe operations or inspect conflicts. A failed node remains visible. A timed-out stop remains `stopping` until processes are confirmed dead or marked unreachable.

## Technical Aspects

Patterns include:

- Stable idempotency keys for user and agent commands.
- Transactional outboxes for cross-Agent events.
- Leases with expirations for destination integration.
- Heartbeats and last-progress timestamps for active runs.
- Tombstones for deleted resources.
- Periodic reconciliation of active or suspicious resources.
- Checksums and commit IDs for checkpoint integrity.
- Dead-letter queues for failed secondary processing.

Workflows store external resource IDs immediately after creation. Compensation archives orphan Artifacts, revokes tokens, and stops Sandboxes where safe.

## Invariants

- Retrying a completed step does not duplicate its effect.
- A UI status distinguishes intent from confirmed result.
- Authoritative state can be reconstructed without Analytics Engine.
- Destructive cleanup follows durable retention and dependency checks.

