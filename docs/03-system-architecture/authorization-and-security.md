# Authorization and Security

## Idea

Every workspace, repository, process, secret, and delegated agent must be bounded by explicit identity and capability checks.

## Core Concept

Authentication establishes an actor. Organization, project, and node policy determine roles. Agent runs receive short-lived capabilities rather than inheriting broad permanent credentials.

Capabilities include viewing, collaborating, changing objectives, modifying code, starting compute, accessing specific secrets, creating children, spawning agents, approving work, integrating results, changing budgets, and pruning.

## Intent

Users must be able to trust that a child agent cannot inspect siblings, exceed ancestor authority, expose secrets in logs, or push to an unrelated repository.

## Execution Concept

The Worker authenticates every request and WebSocket upgrade. ProjectAgent or NodeAgent performs resource-specific authorization. Read-only connections receive read projections but cannot invoke mutation methods. Approval gates interrupt operations that exceed preauthorized capabilities.

Artifact tokens are repo-scoped, short-lived, and minted only after authorization. Sandbox secrets are injected for a run and removed or revoked when it ends. Network access follows node and run policy.

## Technical Aspects

Maintain role assignments and capability grants with version and expiry. Verify authorization at the point of mutation rather than trusting client props. Audit entries connect the initiating human, agent identity, run, node, tool, and resulting event.

Redact secrets before logs leave the execution boundary. Use separate production and staging namespaces. Treat preview URLs as capabilities and place application authorization in front of sensitive services.

## Invariants

- Delegation can narrow but never widen authority.
- Account-level Cloudflare credentials never enter a user or agent Sandbox.
- Revocation prevents new operations even if a client connection remains open.
- Authorization failures are audited without revealing protected data.

