# System Architecture

## Idea

The system architecture maps product boundaries to Cloudflare primitives while keeping domain state recoverable and independently understandable.

## Core Concept

D1 discovers projects, ProjectAgents coordinate projects, NodeAgents coordinate workspaces, Artifacts preserve code, Sandboxes execute code, and Workflows move operations reliably across resources.

Documents:

- [Platform topology](./platform-topology.md)
- [Data ownership](./data-ownership.md)
- [ProjectAgent](./project-agent.md)
- [NodeAgent](./node-agent.md)
- [Event model](./event-model.md)
- [Authorization and security](./authorization-and-security.md)
- [Reliability and consistency](./reliability-and-consistency.md)

## Intent

The architecture should allow millions of independent workspace identities without requiring always-running servers, while providing strong local coordination and explicit recovery for cross-resource work.

## Execution Concept

Requests enter through Workers, route to the appropriate project or node authority, and start external execution only when necessary. Clients subscribe to the smallest relevant live state boundary.

## Technical Aspects

Cross-resource operations are never assumed atomic. They use durable Workflows, idempotency keys, state-machine transitions, compensating actions, and reconciliation.

