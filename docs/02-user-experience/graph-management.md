# Graph Management Experience

## Idea

The graph is both a map of project work and an interface for organizing, governing, and simplifying it.

## Core Concept

The default view emphasizes active containment. Status, ownership, current action, integration state, and descendant counts decorate nodes. Users can switch overlays for delegation, code lineage, dependencies, handoffs, or archived work.

## Intent

The graph should improve orientation rather than reward graph complexity. Users need safe operations for creation, movement, grouping, pruning, and restoration.

## Execution Concept

Core operations are:

- Create child from a node or message context.
- Delegate a scoped objective to a human or agent.
- Change visual grouping without changing origin.
- Add or remove a dependency.
- Change a handoff destination.
- Collapse a subtree.
- Review and prune completed nodes.
- Reveal archived nodes and restore them.

Nodes show compact summaries at low zoom and richer operational cards at high zoom. Filters isolate active work, one actor, pending review, unmerged code, failures, stale nodes, or a milestone.

## Technical Aspects

Graph layout is derived client-side from a versioned ProjectAgent snapshot. Mutations are server commands, not local graph edits. The UI applies optimistic placeholders only for provisioning operations and resolves them from authoritative graph events.

Large graphs use virtualization, level-of-detail rendering, clustering, and archived-subtree counters. Search uses D1 or a project index but resolves selected nodes through ProjectAgent.

## Invariants

- The interface visually distinguishes containment, lineage, dependency, and return edges.
- Dragging a node cannot silently rewrite Git lineage.
- Failed provisioning remains visible and recoverable.

