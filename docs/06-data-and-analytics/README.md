# Data and Analytics

## Idea

The product needs exact operational state for control and separate historical telemetry for trends, capacity, and product understanding.

## Core Concept

ProjectAgent rollups power live mission control. D1 powers global discovery and project summaries. Analytics Engine powers historical aggregate analysis. Cloudflare product metrics power internal infrastructure observability.

Documents:

- [Operational rollups](./operational-rollups.md)
- [Historical analytics](./historical-analytics.md)
- [Observability and audit](./observability-and-audit.md)

## Intent

Users should receive actionable status rather than vanity metrics. Operators should diagnose infrastructure without exposing internal platform metrics as user progress.

## Execution Concept

Live views use exact state and drill down to work. Historical views show completion, intervention, cost, review, and integration trends. Audit views reconstruct attributable decisions and mutations.

## Technical Aspects

Events feed separate projections with different consistency and retention requirements. Sampling-aware analytics never controls budgets or active status.

