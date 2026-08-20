import assert from "node:assert/strict";
import test from "node:test";
import {
  drawingHash,
  executableOrder,
  generateOperationDrawing,
} from "../app/operation-model.ts";

test("integration drawing contains independent parallel and reciprocal edges", () => {
  const drawing = generateOperationDrawing("integration", "Improve cache locality.");
  const candidateToReview = drawing.edges.filter(
    (edge) => edge.source === "candidate" && edge.target === "review",
  );
  const reviewToCandidate = drawing.edges.filter(
    (edge) => edge.source === "review" && edge.target === "candidate",
  );

  assert.equal(candidateToReview.length, 2);
  assert.deepEqual(
    candidateToReview.map((edge) => edge.data?.channel).sort(),
    ["artifact", "result"],
  );
  assert.equal(reviewToCandidate.length, 1);
  assert.equal(reviewToCandidate[0].data?.channel, "feedback");
  assert.equal(reviewToCandidate[0].data?.execution, false);
});

test("feedback edges do not create execution cycles", () => {
  const drawing = generateOperationDrawing("integration", "Integrate node B.");
  const result = executableOrder(drawing.nodes, drawing.edges);

  assert.equal(result.error, null);
  assert.equal(result.order.length, drawing.nodes.length);
  assert.ok(result.order.indexOf("candidate") < result.order.indexOf("review"));
  assert.ok(result.order.indexOf("review") < result.order.indexOf("integrate"));
});

test("drawing hash binds semantic edits to a different revision artifact", () => {
  const drawing = generateOperationDrawing("setup", "Set up a TypeScript project.");
  const original = drawingHash(3, drawing.nodes, drawing.edges);
  const changedNodes = drawing.nodes.map((node) =>
    node.id === "health"
      ? { ...node, data: { ...node.data, instruction: "Run every test." } }
      : node
  );
  const changed = drawingHash(4, changedNodes, drawing.edges);

  assert.notEqual(original, changed);
});

