# Observability and Audit

## Idea

Operational observability explains system health; audit history explains who authorized and performed meaningful product actions.

## Core Concept

Observability includes Worker requests, Durable Object invocations, Workflow progress, Queue retries, Artifact operations, Sandbox lifecycle, D1 queries, errors, latency, and resource use. Audit includes membership, permission, budget, delegation, secret access, integration, stop, pruning, export, and deletion actions.

## Intent

Operators need to diagnose failures without reading customer work content unnecessarily. Users need trustworthy provenance for consequential actions.

## Execution Concept

Internal dashboards correlate infrastructure traces by project, node, run, operation, and event IDs. User audit views present actor, action, target, time, reason, and outcome with sensitive payloads redacted.

## Technical Aspects

Use Cloudflare GraphQL analytics for platform-provided metrics and application logs for structured errors. Store immutable audit records in authoritative Agent storage and export or compact them to R2 according to retention policy. Propagate correlation IDs through Worker, Agents, Workflows, Sandbox operations, and Queues.

Never place tokens, environment secrets, raw private prompts, or unrestricted file contents in logs or Analytics Engine.

## Invariants

- Audit actions remain attributable after pruning.
- Log access is narrower than ordinary workspace access.
- Redaction happens before external emission.

