# User Experience

## Idea

The interface should make a large graph of concurrent work feel more understandable than a set of chats, terminals, branches, and dashboards.

## Core Concept

There are three primary surfaces: the node workspace for focused work, project mission control for oversight, and the graph for structure and navigation. Reconciliation and local checkout bridge agent work with human review and existing development habits.

Documents:

- [Node workspace](./node-workspace.md)
- [Project mission control](./mission-control.md)
- [Graph management](./graph-management.md)
- [Reconciliation experience](./reconciliation.md)
- [Local checkout and CLI](./local-checkout.md)

## Intent

Users should spend their attention on objectives, exceptions, and decisions—not continuously supervise agent output.

## Execution Concept

The default entry is mission control when a project has active parallel work and the last-open node when it does not. Every summary number drills into the graph, node, run, or event that produced it.

## Technical Aspects

Mission control subscribes to ProjectAgent. A node workspace subscribes to NodeAgent and opens additional Sandbox streams only for active terminal, preview, or file-watching modes. URLs contain project, node, and mode identifiers for durable navigation.

