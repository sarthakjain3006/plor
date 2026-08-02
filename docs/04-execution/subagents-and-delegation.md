# Subagents and Delegation

## Idea

Subagents use the same visible workspace system as humans instead of operating as hidden background threads.

## Core Concept

Delegating a meaningful objective normally creates a child node with inherited context, Artifact fork, scoped policy, assignee, and budget. The parent run and initiating human remain attributable.

## Intent

Users should know what was delegated, why, to whom, at what cost, with which permissions, and what result returned. Delegation should enable parallelism without escaping governance.

## Execution Concept

An agent calls `spawnWorkspace` with objective, completion criteria, context selection, code inheritance, assignee, permissions, budget, and expected output. ProjectAgent validates policy and starts node provisioning. The child becomes visible immediately.

The parent can monitor, redirect, pause, or stop descendants. The child reports through a handoff. Small helper tasks that do not need independent state may remain internal runs, but the UI discloses them and they cannot create durable code divergence silently.

## Technical Aspects

Delegation records `parentRunId`, `sourceNodeId`, `childNodeId`, `initiatedBy`, policy snapshot, and reserved budget. Child capabilities are the intersection of requested capability and every ancestor grant. Delegation depth, concurrency, and spend are enforced by ProjectAgent.

## Invariants

- Subagent work with independent durable output has a visible node.
- Child policy cannot exceed ancestor policy.
- Stopping a parent explicitly addresses active descendants.

