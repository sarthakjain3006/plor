# Workspace Modes

## Idea

Chat is one way to work inside a node, not the container for all node information.

## Core Concept

Every mode is a view over the same node identity and objective:

- **Objective:** Purpose, constraints, completion criteria, and expected output.
- **Work:** Plan, work items, assignments, blockers, and progress evidence.
- **Chat:** Human-agent and human-human conversation.
- **Notes:** Editable working memory and references.
- **Decisions:** Structured choices, rationale, alternatives, and provenance.
- **Summary:** Maintained account of progress, outcomes, risks, and next steps.
- **Code:** Repository tree, changes, commits, and diffs.
- **Terminal:** Interactive processes in the active Sandbox.
- **Preview:** Services exposed from the Sandbox.
- **Activity:** Append-only timeline of meaningful events.
- **Handoffs:** Submissions to and feedback from destination nodes.

## Intent

The modes separate information by purpose so users do not have to mine a transcript for decisions, progress, or code. They should still feel like one workspace rather than independent applications.

## Execution Concept

The node header persists across modes and shows objective, status, current action, ownership, spend, and controls. Deep links preserve node and mode. Important activity in one mode updates relevant projections in others—for example, a pushed commit creates activity, updates code state, and may make the summary stale.

Modes may be hidden when irrelevant. A research node may emphasize notes and evidence; a coding node may emphasize code, terminal, and checks. Mode configuration does not change the node's core lifecycle.

## Technical Aspects

Modes query NodeAgent methods rather than maintaining independent client-side authorities. Large content is paginated or stored externally with references. Real-time state uses WebSocket messages; terminal and file-watch streams use dedicated channels where appropriate. Mode permissions are derived from node roles and scoped capabilities.

## Invariants

- Switching modes never changes the active node.
- Chat history is not the only source of decisions or progress.
- Summary content identifies its freshness and source checkpoint.

