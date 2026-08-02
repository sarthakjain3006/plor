# Roadmap

## Idea

The product should validate its core control and reconciliation loop before expanding into a complete browser IDE or enterprise orchestration platform.

## Core Concept

Delivery proceeds from durable node semantics to collaboration, code isolation, agent orchestration, and advanced governance.

Documents:

- [Minimum viable product](./mvp.md)
- [Delivery phases](./delivery-phases.md)
- [Risks and open decisions](./risks-and-open-decisions.md)

## Intent

Each phase should produce a coherent user outcome and preserve the domain model needed by later phases.

## Execution Concept

Build the smallest vertical slice that lets a user create nodes, track structured work, submit a handoff, selectively update a parent, and prune the child. Add live agent execution only after this loop is durable.

## Technical Aspects

Schema and event contracts should be introduced incrementally with migrations and feature flags. Beta platform dependencies require adapters, export paths, and failure testing.

