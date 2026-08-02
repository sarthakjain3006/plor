# Persistence and Checkpoints

## Idea

Checkpoints turn active work into recoverable evidence and separate durable code history from temporary execution state.

## Core Concept

There are three persistence classes:

- Artifact commits for durable versioned project files.
- R2 objects and Sandbox backups for large outputs, caches, or uncommitted runtime continuity.
- NodeAgent records for checkpoint summary, evidence, and resource references.

## Intent

A stopped Sandbox should be inexpensive, and a resumed node should restore useful state without treating opaque filesystem snapshots as the only record of work.

## Execution Concept

Checkpoints occur on meaningful progress, before fork, before graceful pause, before handoff, and before integration. A checkpoint reports commit, dirty state, tests, artifacts, completed items, risks, and actor.

If work is commit-ready, push to Artifacts. If uncommitted state is intentionally retained, create a Sandbox backup and mark the checkpoint accordingly. Caches may expire independently.

## Technical Aspects

Sandbox backups use R2-backed point-in-time archives and must be restored after container restart. Backup handles, TTL, directory, content policy, and checksum are stored in NodeAgent. Partially written files require quiescing processes before backup.

Retention policies distinguish source, evidence, cache, logs, and ephemeral outputs. A restore verifies Artifact head and backup compatibility before allowing writes.

## Invariants

- A checkpoint states whether uncommitted work exists.
- Cache loss cannot imply source-code loss.
- Handoff versions reference immutable checkpoints.

