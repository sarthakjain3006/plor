# Graph and Edges

## Idea

The project is navigated as a graph, but different relationships must retain distinct meanings.

## Core Concept

The active organizational view is normally a rooted tree. The complete domain graph adds typed edges:

```ts
type EdgeType =
  | "child_of"
  | "forked_from"
  | "delegated_by"
  | "depends_on"
  | "submitted_to"
  | "integrated_into"
  | "references"
  | "supersedes";
```

`child_of` organizes the active workspace view. `forked_from` records immutable code lineage. `delegated_by` attributes agent delegation. `depends_on` captures planning order. `submitted_to` and `integrated_into` form return paths. Reference and supersession edges preserve knowledge relationships.

The project graph and an operation drawing are separate graph types. Project edges describe durable workspace relationships. Operation edges describe the flow of one setup or integration attempt.

## Intent

Users need a simple tree for orientation without losing the richer reality of work. Reorganizing the visible graph must not rewrite code origin, actor attribution, or past integrations.

## Execution Concept

The default graph emphasizes active containment and current status. Filters reveal code lineage, delegation, dependencies, return edges, archived nodes, or a single actor's work. Edge selection explains what crossed that relationship.

Allowed operations include create child, move visual grouping, add dependency, change integration target, archive, restore, collapse, and inspect lineage. Operations that would create containment or dependency cycles are rejected. Return edges may point upward without changing ancestry.

The UI may show reciprocal or parallel edges between the same pair of nodes. Each direction remains a separate semantic record so a request, result, artifact, context transfer, and approval can carry independent status and history.

## Technical Aspects

The ProjectAgent is authoritative for nodes and edges and serializes graph mutations. Each mutation accepts an idempotency key and increments a project graph version. Clients apply versioned graph patches and request a snapshot if they miss an event.

Maintain immutable origin fields separately from mutable organizational fields. Deleting an edge never deletes the nodes it connected. Derived values such as depth and descendant count are rollups, not authorities.

React Flow renders interactive project and operation views with distinct schemas. Multiple handles distinguish semantic channels. Parallel and reciprocal custom edges use stable offsets and retain unique IDs; visual pairing never collapses their domain records.

## Invariants

- Containment and code-lineage graphs are acyclic.
- A visual move cannot mutate `forked_from`.
- Graph operations are authorized and auditable.
- Return edges do not make a child an ancestor of its parent.
- Two visually paired edges remain independently addressable and auditable.
