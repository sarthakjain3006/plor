# Forking and Inheritance

## Idea

Creating a child node establishes an exact context and code baseline from which independent work can diverge.

## Core Concept

Inheritance includes selected objective context, notes or decisions, policy, budget reservation, completion criteria, and an Artifact fork at a recorded source commit. Inheritance is explicit; a child does not automatically receive every ancestor message, secret, or permission.

## Intent

Forks should be reproducible and understandable. A reviewer must know what the child knew and which code it began from.

## Execution Concept

Before forking, the parent reaches a checkpoint. The creator selects or accepts default context, defines the child objective, and chooses assignees and limits. The child appears as provisioning while ForkNodeWorkflow creates its repository and NodeAgent state.

Changes after the fork do not flow automatically. The child can fetch parent updates deliberately, rebase, or continue from its original baseline.

## Technical Aspects

The fork record includes parent node, source repository, source commit, parent checkpoint, selected context bundle hash, policy snapshot, and operation ID. The Artifact fork is created with appropriate history depth. Initialization is idempotent and compensates orphan resources on permanent failure.

## Invariants

- Every child code workspace has an exact recorded base commit.
- Secret inheritance is opt-in and capability checked.
- Updating the parent does not silently rewrite child state.

