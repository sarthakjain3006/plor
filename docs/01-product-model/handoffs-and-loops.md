# Handoffs and Feedback Loops

## Idea

Objectives and context move downward through delegation; results return upward or sideways through versioned handoffs.

## Core Concept

A handoff is a durable proposal from a source node to a destination node. It contains an outcome, summary, decisions, evidence, commits, artifacts, risks, unfinished work, and recommended destination updates.

Statuses include draft, submitted, under review, changes requested, accepted, partially accepted, rejected, and integrated. A source can submit multiple versions while remaining the same workspace.

## Intent

The product must support feedback loops without spawning a new node for every revision. Reviewers should accept knowledge, code, decisions, artifacts, and follow-up work independently.

## Execution Concept

The source prepares a handoff from a checkpoint. The destination reviews categories independently, requests changes, or accepts selected items. A changes request reopens relevant source work. Acceptance creates an integration operation and, when successful, an immutable receipt.

Multiple sibling nodes can submit into a synthesis node, which compares approaches before handing a recommendation to the parent. Recurring monitoring nodes may issue repeated reports without completing.

## Technical Aspects

Handoffs are stored as immutable versions with mutable review status. Payload items use stable IDs so acceptance is itemized. Code references include origin commit, source head, and selected commits. The destination records its before and after commits.

ProjectAgent owns cross-node status and review routing; NodeAgents own source preparation and destination application details. Workflows execute multi-resource integration.

## Invariants

- Submitted versions cannot be edited in place.
- Partial acceptance is explicit.
- A rejected implementation does not require rejecting valid findings.
- A child remains available until its handoff is reconciled or explicitly discarded.

