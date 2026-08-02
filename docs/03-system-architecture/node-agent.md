# NodeAgent

## Idea

The NodeAgent is the durable collaborative coordinator for one workspace node.

## Core Concept

It owns node-local state: objective details, completion criteria, messages, notes, decisions, summary, work items, assignments, runs, actions, checkpoints, approvals, handoff drafts and versions, local events, and resource mappings.

It coordinates multiple users and agent runs; it is not itself synonymous with one model invocation.

## Intent

The NodeAgent gives each workspace an addressable, strongly consistent, real-time home that can hibernate when idle and resume without losing context.

## Execution Concept

Opening a node establishes a WebSocket connection. Mutations update local SQLite and broadcast state patches. Starting work launches a Workflow or short Agent operation. Tool execution calls the node Sandbox. Meaningful changes emit durable local events and upward rollup events.

## Technical Aspects

Suggested tables:

```text
node_state
completion_criteria
messages
notes
decisions
work_items
work_item_dependencies
assignments
runs
run_actions
checkpoints
approvals
handoffs
handoff_items
local_events
outbox
```

The outbox records important upward events in the same local transaction as state changes. A delivery process sends them to ProjectAgent and marks acknowledgement. Node snapshots include monotonic sequence and state version.

## Invariants

- Durable state is never held only in memory.
- NodeAgent cannot insert itself into the project graph.
- Upward rollups contain no secret or unnecessarily detailed content.

