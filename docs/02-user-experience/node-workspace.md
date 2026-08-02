# Node Workspace Experience

## Idea

The node workspace is the focused environment in which humans and agents pursue one objective together.

## Core Concept

The persistent header shows title, status, objective summary, owners, active actors, spend, last progress, and primary controls. The body switches among workspace modes. A contextual side panel can show plan, participants, current activity, or lineage without leaving the node.

## Intent

Opening a node should restore orientation in seconds. The interface must clearly separate what the agent says, what the system observes, and what reviewers have accepted.

## Execution Concept

The default mode is Work for active nodes, Chat for simple new nodes, and Handoff for nodes awaiting review. The header shows:

```text
OAuth refresh handling                         Running
3/6 items complete     $4.20 / $10     last progress 2m ago
Current: Running authentication tests
[Pause after step] [Request report] [Stop]
```

Selecting a work item reveals its attempts, actions, evidence, and assigned actors. Selecting an active action opens live output. Important edits and decisions can be promoted from chat into structured notes, work items, or decisions.

## Technical Aspects

The initial page hydrates from a NodeAgent snapshot. WebSocket patches update operational state. Paginated queries load message, activity, and action history. Terminal sessions and process logs use Sandbox APIs and are authorized per connection. Optimistic edits carry expected versions and surface conflicts explicitly.

## Failure Cases

- If the NodeAgent is unavailable, show the last durable snapshot and retry state rather than an empty workspace.
- If the Sandbox is asleep, code history remains readable from Artifacts while execution controls show resume status.
- If the summary is stale, display the checkpoint it reflects and offer refresh.

