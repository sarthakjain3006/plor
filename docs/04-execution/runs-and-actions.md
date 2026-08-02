# Runs and Actions

## Idea

A run is a bounded attempt to advance a node work item; actions are the concrete operations within that attempt.

## Core Concept

Run states include queued, preparing, running, waiting for model, running tool, awaiting approval, checkpointing, pausing, paused, stopping, completed, failed, and cancelled.

Actions include model inference, file inspection, edits, commands, tests, process waits, child creation, approval waits, commits, and handoff submission.

## Intent

Separating runs from work items preserves retry history and makes progress, cost, and failure attributable. Separating actions from runs lets users see exactly what an agent is doing.

## Execution Concept

Each run shows objective, responsible actor, initiator, current action, reason, next action, elapsed time, usage, child runs, latest evidence, and safe stopping point. A completed run reports outcome, checks, changes, risks, and recommended next work.

## Technical Aspects

NodeAgent persists run and action transitions before broadcasting them. Active Sandbox process IDs and Workflow IDs are attached to actions. Streamed output is stored separately from compact status. Each action carries cancellation support and a classification of whether it is read-only, reversible, checkpointable, or destructive.

## Invariants

- A run has one terminal outcome.
- Actions cannot remain `running` after their enclosing run is terminal without a recorded anomaly.
- Usage is attributed to both run and ancestor budget paths.

