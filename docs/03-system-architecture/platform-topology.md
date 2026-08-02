# Platform Topology

## Idea

Use Cloudflare's stateful edge and agent primitives as a coherent platform rather than reconstructing a generic container-control system.

## Core Concept

```text
Browser / CLI
      │
      ▼
Vinext + API Worker
  ├── identity and authorization
  ├── D1 organization/project directory
  ├── Agent routing
  └── Sandbox preview proxy
      │
      ├── ProjectAgent(projectId)
      └── NodeAgent(nodeId)
              ├── Workflows(runId / operationId)
              ├── Artifacts repo(nodeId)
              ├── Sandbox(nodeId)
              ├── R2 artifacts and backups
              ├── Queues
              └── Analytics Engine
```

## Intent

The topology provides globally addressable collaborative workspaces, on-demand execution, durable Git storage, and human-in-the-loop operations without managing Kubernetes or a persistent fleet.

## Execution Concept

The Worker validates requests before they reach stateful resources. A project view routes to ProjectAgent; a node view routes to NodeAgent. Starting code work obtains the node Sandbox and authenticated Artifact remote. Long operations return control to the UI while a Workflow proceeds and reports progress.

## Technical Aspects

Suggested deterministic mappings:

```text
projectId → ProjectAgent instance name
nodeId    → NodeAgent instance name
nodeId    → Artifact repository name
nodeId    → Sandbox ID
runId     → Workflow instance ID
```

Domain IDs remain canonical. Resource creation status is stored explicitly. Deployments use SQLite-backed Durable Object migrations. Sandbox communication uses the supported RPC transport. Preview traffic routes through an authorized Worker proxy and custom domain.

## Failure Cases

- A created domain node may temporarily lack an Artifact or Sandbox; provisioning state represents this honestly.
- A sleeping Sandbox is normal and restored from Artifact plus optional backup.
- A Durable Object restart must reconstruct live projections from durable storage.

