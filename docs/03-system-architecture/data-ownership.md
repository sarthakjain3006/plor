# Data Ownership

## Idea

Every record needs one clear authority so that live collaboration, cross-project discovery, execution, and analytics do not become competing truths.

## Core Concept

| Data | Authority |
|---|---|
| Organizations, users, project discovery | D1 |
| Project graph, project controls, node rollups | ProjectAgent SQLite |
| Node objective, work ledger, chat, notes, summary | NodeAgent SQLite |
| Source code, commits, refs | Artifacts |
| Active filesystem and processes | Sandbox |
| Large outputs and optional backups | R2 |
| Multi-step operation state | Workflows |
| Secondary delivery | Queues |
| Long-term aggregate telemetry | Analytics Engine |

## Intent

The UI should know which source to trust, and failures in one subsystem should not overwrite durable truth in another.

## Execution Concept

Views compose authorities through references and projections. The project graph uses NodeAgent rollups rather than detailed node reads. The code view reads durable history from Artifacts and active filesystem state from Sandbox. Historical charts use analytics, while stop buttons use exact ProjectAgent state.

## Technical Aspects

D1 project summaries and ProjectAgent node rollups are materialized projections. They carry source versions and timestamps. Projections can be stale without becoming authoritative. Reconciliation fetches targeted authority snapshots.

Large content records store metadata and R2 keys rather than embedding binaries in Agent SQLite. Secrets are never stored in events, summaries, Analytics Engine, or repository metadata.

## Invariants

- Analytics data cannot authorize or control work.
- Sandbox files are not durable until pushed or backed up.
- A projection identifies its source version.
- Domain records do not depend on user-facing titles for identity.

