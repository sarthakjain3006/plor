# Pause, Stop, and Cancellation

## Idea

Users need precise controls for ending work without confusing compute termination, workspace retention, and completion.

## Core Concept

- **Pause:** Checkpoint and suspend with intent to resume.
- **Finish current step:** Complete the current action, checkpoint, then stop scheduling.
- **Stop now:** Cancel execution and terminate active processes while preserving recoverable state.
- **Complete:** Declare the objective concluded and prepare a final handoff.
- **Abandon:** End work without proposing integration.
- **Delete:** Separate retention operation, never an execution control.

## Intent

Stopping should be trustworthy and explain consequences before action. Graceful stopping is preferred, but immediate interruption remains available.

## Execution Concept

The stop dialog lists affected runs, descendants, processes, uncommitted state, current action safety, and reserved budget. Users choose node-only, node-and-descendants, or reassign-descendants behavior.

A graceful stop prevents new actions, lets the current action finish, pushes or backs up recoverable work, updates the summary, and transitions to paused. Immediate stop cancels Workflows, kills Sandbox processes, revokes temporary credentials, and records preserved state.

## Technical Aspects

ProjectAgent creates a versioned StopRequest and marks the scope `stopping`. StopWorkflow traverses descendants, signals NodeAgents, terminates Workflow instances, kills Sandbox processes, revokes run grants, reconciles status, and produces a report. Repeated commands use the same stop operation ID.

## Invariants

- `stopping` is not `stopped`.
- Stop does not delete Artifacts, node records, or accepted history.
- A terminal stop report identifies work that could not be checkpointed.

