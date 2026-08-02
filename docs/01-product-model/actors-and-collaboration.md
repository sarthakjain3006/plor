# Actors and Collaboration

## Idea

Humans, agents, and services collaborate inside the same workspace model while retaining distinct identities, capabilities, and accountability.

## Core Concept

An actor is one of:

- Human user.
- Agent identity or configuration.
- Agent run.
- Trusted service.
- Platform system actor.

Node roles include owner, editor, reviewer, viewer, and scoped agent. Role assignment determines capabilities such as reading, messaging, editing notes, changing objectives, modifying code, starting compute, using secrets, creating children, approving handoffs, and integrating work.

## Intent

Collaboration should feel like a shared project room rather than group chat. Users must be able to distinguish who proposed a change, which human initiated an agent, which run executed it, and what tools were used.

## Execution Concept

Multiple users connect to the same NodeAgent and receive presence and workspace updates. Assignments connect actors to work items. Agent runs have explicit initiators and permission grants. Subagent delegation records both the parent run and responsible human lineage.

For simultaneous code work, small coordinated edits can share a node using participant branches. Substantial independent work should create child nodes with independent repositories and Sandboxes.

## Technical Aspects

Authentication occurs at the Worker boundary. Authorization is checked again for callable NodeAgent and ProjectAgent operations. Connection attachments carry user identity and read-only status through WebSocket hibernation. Agent capabilities are short-lived grants tied to a run, node, tool set, budget, and secret scope.

Audit records include `actorId`, `actorType`, `initiatedBy`, `runId`, `nodeId`, `projectId`, and operation metadata.

## Invariants

- Agents cannot gain permissions by delegating.
- A descendant run consumes ancestor policy and budget.
- Attribution survives pruning and compaction.
- Presence is advisory; permissions are authoritative server state.

