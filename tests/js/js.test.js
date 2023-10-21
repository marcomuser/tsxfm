import { describe, it } from "node:test";
import assert from "node:assert/strict";

await import("#tsxfm");

describe("js default nextLoad", async () => {
  it("handles hello world javascript function from ES module", async () => {
    const { helloWorld } = await import("./fixtures/helloWorld.js");

    assert.equal(helloWorld(), "hello world!");
  });

  it("handles CommonJS module with simulated default export", async () => {
    const { default: helloWorld } = await import(
      "./fixtures/commonjs/defaultExport.js"
    );

    assert.equal(helloWorld(), "hello world!");
  });
});
