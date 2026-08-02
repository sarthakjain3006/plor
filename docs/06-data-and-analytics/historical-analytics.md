# Historical Analytics

## Idea

Historical analytics reveals how effectively humans and agents turn delegated objectives into accepted outcomes over time.

## Core Concept

Useful metrics include:

- Time from node creation to first progress, handoff, and integration.
- Work-item and completion-criteria throughput.
- Agent run success, retry, and human-intervention rates.
- Fork-to-handoff and handoff-to-integration conversion.
- Review latency and changes-requested cycles.
- Merge-conflict and check-failure rates.
- Cost per completed objective and accepted result.
- Delegation depth, descendant count, and abandoned-work rate.
- Sandbox active time and restore latency.

## Intent

Metrics should help users improve work decomposition and agent policy. Message count, raw lines changed, and node count are context, not performance measures.

## Execution Concept

Project and organization dashboards offer trends with drill-down links. Users can compare modes, agents, objective types, or time periods while respecting access boundaries. Cost views distinguish consumed from reserved budget.

## Technical Aspects

Workers Analytics Engine receives non-blocking structured points with organization or project sampling keys, categorical dimensions, and numeric measures. Queries account for sampling intervals. D1 retains exact financial and quota ledgers.

Artifacts GraphQL analytics supplements repository operation and latency views. Cloudflare datasets have their own retention windows, so durable product history comes from owned events and aggregates.

## Invariants

- Sampled analytics does not enforce exact limits.
- User metrics respect project authorization and tenant isolation.
- Metric definitions are versioned when semantics change.

