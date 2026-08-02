# Code Integration

## Idea

Code integration selectively transfers commits or changes from a source Artifact repository into a destination repository.

## Core Concept

The integration uses the child's recorded source commit as common base, its selected head as source, and the destination's current head as target. A dedicated integration agent proposes an editable operation drawing and prepares results on a candidate ref in its own Sandbox. Results may be merge commits, rebases, cherry-picked commits, selected files or hunks, or a rejected code proposal.

## Intent

Integration should be reviewable, conflict-aware, reproducible, and independent from accepting the child's non-code findings.

## Execution Concept

The integration agent reads source, destination, node, and conversation context and generates a drawing. The reviewer edits it and authorizes an immutable revision for execution. A separate integration Sandbox fetches both repositories, creates a candidate ref, applies the approved strategy, runs checks, and attaches diffs and evidence to the drawing.

The source and destination nodes continue independently throughout this process. Their active Sandboxes do not change checkout. Complex conflicts can create another drawing revision or a temporary integration node. After code review, ProjectAgent obtains a short destination integration lease and atomically advances the destination from its expected head to the approved candidate. The integration receipt closes the operation.

## Technical Aspects

The receipt stores the approved drawing revision and hash, base, source head, candidate head, destination before and after, selected commits and items, check results, conflict resolutions, reviewers, actor, and timestamps. Expected destination head prevents stale application. Artifact event handling confirms the push before success is published.

The destination repository is locked only for mutation-critical integration steps; long human review happens before lease acquisition.

## Invariants

- Only one integration mutates a destination head at a time.
- A successful receipt points to a durable destination commit.
- Source pruning is not part of the same irreversible step as code application.
- Integration work never pauses or mutates the active Sandbox checkout of either node.
