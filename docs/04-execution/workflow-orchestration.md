# Workflow Orchestration

## Idea

Durable Workflows coordinate operations that span time, services, retries, or human approval.

## Core Concept

Workflow types include node provisioning, drawing execution, Sandbox activation, checkpointing, handoff preparation, reconciliation, subtree stop, archive, compaction, and deletion. They are compiled platform mechanics, not user-authored step lists or the primary planning interface.

## Intent

An interrupted Worker request or Durable Object restart must not lose a long-running operation or repeat completed external effects.

## Execution Concept

An agent generates an operation drawing from current context and the human modifies it. Starting a run freezes one drawing revision, which durable orchestration validates and executes through the appropriate services. It publishes progress and evidence back to drawing operations, waits at explicit approval boundaries, and retries safe transient effects.

Waiting applies to the operation instance, agent turn, or approval gate. Workspace nodes are durable independent contexts and are never paused by a Workflow.

## Technical Aspects

Each Workflow instance uses the domain operation ID when possible. Every external mutation is wrapped in an idempotent internal step and stores its result. Internal steps are derived from a validated drawing snapshot and platform policy. They pass references rather than large blobs. Approval events contain the expected drawing revision, candidate commit, operation version, and actor authorization.

Short real-time chat turns need not use Workflows; long work, multi-resource effects, and approval waits do. Agent-internal durable execution may handle narrowly scoped tasks, but project-visible operations retain a Workflow record.

## Invariants

- A Workflow cannot bypass current authorization when resuming.
- A completed external mutation is recorded before the next step.
- Termination produces a domain outcome rather than silently disappearing.
- No Workflow changes the liveness or active checkout of a source or destination node implicitly.
