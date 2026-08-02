# Artifacts Repository Model

## Idea

Cloudflare Artifacts gives every node an isolated, durable, Git-compatible repository that behaves like the cloud equivalent of an independently hosted worktree.

## Core Concept

An Artifact repository has its own remote, refs, history, tokens, lifecycle, and durable state. A node fork uses an Artifacts repository fork rather than a branch in one shared hot repository.

The actual working tree exists in a Sandbox or user's local clone. ArtifactFS is an optional lazy materialization for large repositories, not the node identity itself.

## Intent

Repository-per-node isolation aligns code history with graph lifecycle, permission scope, agent failure boundaries, and independent review.

## Execution Concept

Root projects import or create an Artifact repository. Child nodes fork the source repository after a checkpoint. Humans and agents clone, fetch, commit, and push using standard Git. Artifact push events update node state. Node deletion policy is independent from Sandbox destruction.

Branches may be used for coordinated participants within one node. Autonomous work with a separate lifecycle creates a child node and repository fork.

## Technical Aspects

Project configuration binds one or more Artifacts namespaces. Stable node metadata records namespace, repository name, repository ID, remote, default branch, source repository, source commit, and current head. Repository tokens are minted just in time with read or write scope.

Artifacts is beta infrastructure, so integrated or critical repositories should support mirroring or export until operational guarantees meet product requirements.

## Invariants

- Artifacts is authoritative for committed code, not NodeAgent state.
- Repository token scope never exceeds node authorization.
- Origin commit is recorded before a child becomes ready.

