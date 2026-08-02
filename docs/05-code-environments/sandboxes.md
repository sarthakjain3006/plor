# Sandbox Execution Model

## Idea

A Sandbox gives a node a real isolated Linux environment for commands, files, language runtimes, packages, terminals, background services, tests, and previews.

## Core Concept

`Sandbox(nodeId)` is a stable address for on-demand compute, not a permanently running machine. Its active filesystem and processes survive only while the container remains active unless explicitly backed up.

## Intent

Agents need full development environments without the platform managing its own container fleet. Users need safe isolation and transparent lifecycle state.

## Execution Concept

Activation starts the Sandbox, injects scoped environment configuration, restores optional runtime state or clones the node Artifact, verifies the expected commit, and starts requested sessions. The node exposes terminal, file, process, test, and preview activity.

When a Sandbox sleeps or a run is stopped, its processes stop. The node itself does not pause: its durable context, Artifact, drawings, and collaboration remain available. Important source changes are committed and pushed; valuable uncommitted or expensive runtime state may be backed up. A later activation reconstructs the environment.

## Technical Aspects

Use Sandbox SDK command, file, process, terminal, file-watch, backup, and service-exposure APIs. Set explicit working directories and sessions rather than relying on implicit default session state. Apply CPU, memory, time, disk, network, and process policies.

Preview services route through authorized Worker handling. File-watch and process streams are transient; durable summaries and results are stored elsewhere.

## Invariants

- Sandbox sleep is expected behavior.
- Secrets are scoped to the active run and node.
- A Sandbox cannot access sibling repositories or storage without an explicit grant.
