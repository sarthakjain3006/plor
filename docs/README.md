# From-to-chat Documentation

## Idea

From-to-chat is a collaborative operating environment for human and agent work. It organizes a project as a graph of durable workspace nodes rather than as a collection of linear chat transcripts. This documentation tree is the canonical place to develop that product idea, test its assumptions, and translate it into an implementable system.

## Core Concept

Every node is a self-contained workspace with an objective, collaborators, agent runs, conversation, notes, decisions, a maintained summary, versioned code, and an isolated execution environment. Work moves downward through delegation and returns upward through reviewable handoffs. A project-level control plane lets users understand, govern, integrate, and prune the resulting graph.

The documentation is divided into the following areas:

1. [Foundation](./00-foundation/README.md) — vision, principles, vocabulary, and target users.
2. [Product model](./01-product-model/README.md) — nodes, graph relationships, workspace modes, actors, work tracking, handoffs, and pruning.
3. [User experience](./02-user-experience/README.md) — the node workspace, mission control, graph management, reconciliation, and local checkout.
4. [System architecture](./03-system-architecture/README.md) — Cloudflare topology, data ownership, Agent boundaries, events, authorization, and reliability.
5. [Execution](./04-execution/README.md) — runs, orchestration, subagents, stopping controls, and budgets.
6. [Code environments](./05-code-environments/README.md) — Artifacts, Sandboxes, forking, persistence, and integration.
7. [Data and analytics](./06-data-and-analytics/README.md) — live rollups, historical analysis, and operational telemetry.
8. [Roadmap](./07-roadmap/README.md) — MVP scope, delivery phases, risks, and open decisions.
9. [Document template](./_meta/document-template.md) — the uniform structure used throughout this tree.

## Intent

These documents should make product discussions cumulative. New ideas should refine an existing concept, add a linked concept, or explicitly supersede a previous decision. They should also keep product semantics separate from infrastructure details so that the product can evolve even when individual platform primitives change.

## Execution Concept

Read the tree from top to bottom when learning the system. During design work, update the narrowest relevant document and then update any affected indexes, vocabulary, invariants, and decisions. Cross-cutting changes should be traced through product behavior, user experience, data ownership, and technical execution before being considered settled.

Each document follows the same primary section order:

1. Idea
2. Core Concept
3. Intent
4. Execution Concept
5. Technical Aspects

Documents may then include invariants, failure cases, decisions, or open questions where useful.

## Technical Aspects

The proposed implementation is Cloudflare-native:

- Vinext and Workers provide the application and API edge.
- A `ProjectAgent` Durable Object coordinates each project.
- A `NodeAgent` Durable Object coordinates each workspace node.
- Cloudflare Artifacts stores the durable Git repository associated with a node.
- Cloudflare Sandbox provides an on-demand Linux execution environment.
- Workflows coordinate durable, retryable, and approval-driven operations.
- React Flow presents agent-generated operation drawings with editable typed nodes, dual edges, evidence, and approval state.
- Pi runs as an embedded coding-agent harness inside active Sandbox containers through a product-owned extension.
- D1 provides organization, membership, project discovery, and cross-project indexes.
- R2 stores large artifacts, exports, and optional runtime backups.
- Queues fan out idempotent secondary work.
- Analytics Engine stores long-term aggregate product telemetry.

The current application is a client-side interaction prototype. These documents describe the intended product and target architecture, not the system already implemented in the repository.

## Invariants

- Every piece of work belongs to a node.
- Every node belongs to a project and has durable lineage.
- Every action has an attributable human, service, or agent actor.
- Code and knowledge cross node boundaries only through recorded operations.
- Stopping execution never implicitly deletes workspace history.
- Pruning removes active complexity while preserving accepted outcomes and provenance.
