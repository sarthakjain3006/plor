# Users and Use Cases

## Idea

From-to-chat is initially for people already using coding agents whose primary problem has shifted from generating code to coordinating concurrent work.

## Core Concept

The initial user is a technical founder, lead engineer, or small AI-native team operating several agent tasks in parallel. Adjacent user classes include staff engineers, agent-heavy development teams, software agencies, open-source maintainers, enterprise developer-platform teams, security and reliability teams, and technical researchers.

The core use cases are:

- Decompose a project into independently executable objectives.
- Compare alternative implementations from the same baseline.
- Delegate a bounded investigation to a subagent.
- Collaborate with humans and agents inside a shared node.
- Monitor active work and intervene only when needed.
- Review and selectively integrate completed work.
- Preserve decisions and failed approaches without cluttering active work.

## Intent

The initial product should serve users who run at least several agent tasks concurrently and already feel loss of context, control, or confidence. It should not require users to adopt a heavyweight planning ritual before delegating work.

## Execution Concept

A founder can create separate nodes for authentication, billing, interface work, and testing. A staff engineer can create research nodes for competing architectural approaches and a synthesis node to compare them. A maintainer can delegate issue reproduction, fix development, and compatibility testing while retaining final integration authority.

Users who ask occasional questions or run one task at a time should still find a root node usable, but they are not the primary design center.

## Technical Aspects

Multi-tenancy requires organization and project membership, node-specific overrides, actor attribution, usage accounting, data retention policies, and scoped secret access. Enterprise expansion additionally requires audit export, policy templates, identity-provider integration, and data residency controls.

## Open Questions

- Which initial workflow demonstrates value before full multi-agent orchestration exists?
- Should the first paid boundary be active Sandboxes, agent concurrency, collaborators, or retained graph history?

