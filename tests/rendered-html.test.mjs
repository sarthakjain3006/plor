import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the coding agent workspace", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>From-to Workspace<\/title>/i);
  assert.match(html, /aria-label="Coding agent task"/);
  assert.match(html, /aria-label="Agent conversation"/);
  assert.match(html, /Refine project settings/);
  assert.match(html, /Overview/);
  assert.match(html, /Draw operation/);
});

test("server-renders chat navigation and the initial conversation", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /<aside[^>]+aria-label="Chats"/);
  assert.match(html, /New chat/);
  assert.match(html, /Save feedback now persists across sections/);
  assert.match(html, /Ask Codex to change your code/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/);
});
