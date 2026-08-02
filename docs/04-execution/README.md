# Execution

## Idea

Execution turns node objectives into bounded, observable human and agent activity.

## Core Concept

Work items define desired outcomes; operation drawings let humans and agents shape an approach; runs attempt an immutable drawing revision; actions show what is happening; durable orchestration makes long operations recoverable; controls and budgets keep autonomy bounded.

Documents:

- [Runs and actions](./runs-and-actions.md)
- [Executable operation drawings](./operation-drawings.md)
- [Embedded coding agent runtime](./coding-agent-runtime.md)
- [Workflow orchestration](./workflow-orchestration.md)
- [Subagents and delegation](./subagents-and-delegation.md)
- [Pause, stop, and cancellation](./pause-stop-cancel.md)
- [Budgets and policies](./budgets-and-policies.md)

## Intent

Users should understand active execution without reading raw logs and should be able to intervene at predictable safe boundaries.

## Execution Concept

Execution begins from a work item or explicit request. The agent proposes an editable drawing from context, the user approves an immutable revision for Sandbox execution, and evidence returns to the drawing until a candidate is accepted or abandoned.

## Technical Aspects

NodeAgent owns drawings, approvals, and exact run records. Durable orchestration owns long-lived operation progress. Sandbox owns active processes. The embedded Pi runtime supplies coding intelligence. ProjectAgent owns cross-node rollups and hierarchical control.
