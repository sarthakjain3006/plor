# Local Checkout and CLI

## Idea

Humans should be able to work on a node's Artifact repository using ordinary local Git tools while keeping the node aware of pushed progress.

## Core Concept

An Artifact is a standard Git remote. The node's Sandbox has one checkout, and authorized users may create local checkouts. The platform observes durable pushes, not uncommitted local state, unless a companion CLI reports it.

## Intent

The product should complement existing editors and terminals rather than require all human code work to occur in the browser.

## Execution Concept

`Node → Code → Checkout locally` verifies access and mints a short-lived read or write token. The user clones the remote, works normally, and pushes a personal branch or node main branch according to policy.

A future `fromto` CLI can provide:

```text
fromto checkout <node>
fromto status
fromto checkpoint
fromto submit
fromto open
```

For substantial independent work, the UI recommends creating a personal child node rather than competing on the same branch. The node timeline records pushed commits and indicates that unpushed local state is unknown.

## Technical Aspects

The Worker authorizes the user and mints a short-lived repo-scoped Artifacts token. Credentials should use a helper or temporary configuration rather than remain in shell history. Artifacts push events update NodeAgent code state and ProjectAgent rollups through idempotent events.

The CLI authenticates to the application, never receives an account-level Cloudflare token, and reports only explicitly consented local metadata.

## Invariants

- Local access is scoped to a node repository.
- Read-only users cannot obtain write tokens.
- The UI does not claim visibility into unpushed local changes.

