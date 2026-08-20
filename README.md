# From-to-chat

From-to-chat is a local product prototype for durable human-and-agent workspace nodes. The current vertical slice combines the existing branching conversation with an agent-generated, human-editable operation drawing for node setup and code integration.

## What is implemented

- A branching node conversation and conversation overview.
- A React Flow operation canvas generated from the active conversation context.
- Integration and node-setup drawings.
- Editable operation titles, instructions, types, positions, and connections.
- Parallel edges, reciprocal edges, typed channels, and multiple handles.
- Immutable drawing revisions and deterministic revision hashes.
- A credential-free local Sandbox simulator with streamed, node-level evidence.
- An intentional first-run check failure, followed by an agent-generated repair path.
- Candidate approval bound to the exact drawing revision and candidate commit.
- A local integration/setup receipt.
- Browser persistence for drawings and run history.

The simulator proves the interaction and domain model locally. It does not claim to provide a security boundary. The production adapters described in `docs/` replace deterministic generation with an embedded Pi SDK session and replace simulated execution with Cloudflare Sandbox containers.

## Run locally

Prerequisite: Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Open the local URL printed by Vinext, then:

1. Select **Draw operation** in the node header.
2. Switch between **Integration** and **Setup**.
3. Select a node or edge to edit it.
4. Drag between node handles to create another dependency.
5. Select the two candidate-to-review edges to inspect independent artifact and result channels.
6. Select **Run in sandbox**. The generated check intentionally fails on the first run.
7. Select **Ask Pi to revise drawing** in the evidence panel.
8. Run the new revision.
9. Approve the candidate to produce an integration or setup receipt.

The drawing and run history persist in `localStorage`. Use **Reset local prototype** in the evidence panel to clear them.

## Validate

```bash
npm run lint
npm test
```

The test suite builds the Vinext/Cloudflare application, verifies server-rendered product affordances, and covers dual-edge and execution-order semantics.

## Documentation

Start with [docs/README.md](./docs/README.md). The implementation is based on:

- [Executable operation drawings](./docs/04-execution/operation-drawings.md)
- [Embedded coding agent runtime](./docs/04-execution/coding-agent-runtime.md)
- [Code integration](./docs/05-code-environments/code-integration.md)
- [Graph and edges](./docs/01-product-model/graph-and-edges.md)
