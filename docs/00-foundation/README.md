# Foundation

## Idea

The foundation defines what from-to-chat is, who it serves, and which principles must survive product and infrastructure changes.

## Core Concept

From-to-chat treats delegated work as a graph of durable workspaces. The graph combines planning, execution, collaboration, code lineage, and decision history while keeping each responsibility explicit.

Documents in this section:

- [Vision](./vision.md)
- [Product principles](./principles.md)
- [Vocabulary](./vocabulary.md)
- [Users and use cases](./users-and-use-cases.md)

## Intent

This layer prevents the product from degrading into either a graph-shaped chat client or a conventional project-management dashboard. It provides criteria for evaluating every subsequent feature.

## Execution Concept

Product and technical decisions should cite the applicable principle and use the shared vocabulary. When a concept changes meaning, update the vocabulary first and then reconcile dependent documents.

## Technical Aspects

Foundation documents do not prescribe APIs, but their invariants constrain schemas and service boundaries. In particular, node identity, actor attribution, lineage, handoffs, and pruning must be represented durably rather than inferred from interface state.

