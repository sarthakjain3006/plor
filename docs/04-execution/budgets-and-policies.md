# Budgets and Policies

## Idea

Autonomous work needs explicit limits and escalation conditions so users do not have to supervise continuously.

## Core Concept

Budgets cover money, model tokens, wall time, active compute, number of runs, concurrency, child count, and delegation depth. Policies define permitted tools, networks, secrets, models, destructive actions, approval gates, and automatic stopping rules.

## Intent

The system should stop or ask before exceeding user intent. Cost and authority cannot be bypassed by spawning descendants.

## Execution Concept

Budgets inherit from project to node to run. A child receives a reservation from its parent allocation. Mission control displays committed, consumed, and remaining amounts. Policies can stop or escalate on repeated test failure, inactivity, merge conflict, privileged action, completion satisfaction, runtime threshold, or proposed delegation.

## Technical Aspects

ProjectAgent owns exact hierarchical allocation. NodeAgent reports metered usage with idempotent usage event IDs. The accounting model distinguishes reservation from actual consumption and releases unused reservation at terminal state.

Provider telemetry may be reconciled asynchronously, but preflight enforcement uses conservative local counters. Usage analytics is secondary to the exact ledger.

## Invariants

- Descendant reservations fit within ancestor remaining allocation.
- Budget changes are audited.
- Automatic continuation never overrides a hard stop or expired capability.

