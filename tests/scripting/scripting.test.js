import { describe, it } from "node:test";
import assert from "node:assert/strict";

await import("#tsxfm");

describe("ts scripting", async () => {
  it("transforms hello world typescript function", async () => {
    const { helloWorld } = await import("./helloWorld.js");

    assert.equal(helloWorld(), "hello world!");
  });

  it("resolves import with .js file extension", async () => {
    const { jsImport } = await import("./jsImport.js");

    assert.equal(jsImport(), "hello world!");
  });

  it("resolves import with .ts file extension", async () => {
    const { tsImport } = await import("./tsImport.js");

    assert.equal(tsImport(), "hello world!");
  });

  it("resolves deep import", async () => {
    const { deepImport } = await import("./deepImport.js");

    assert.equal(deepImport(), "hello world!");
  });

  it("handles bare module specifier", async () => {
    const { prettifiedCode } = await import("./prettifiedCode.js");

    assert.equal(await prettifiedCode(), `console.log("hello world!");\n`);
  });

  it("transforms module with .mts file extension", async () => {
    const { mts } = await import("./mts/mts.mjs");

    assert(mts(), "hello world!");
  });

  // it("transforms subpath import with .js file extension", async () => {
  //   const { subpathWithJsExt } = await import("./subpath/subpathWithJsExt.js");

  //   assert.equal(subpathWithJsExt(), "hello world!");
  // });

  it("transforms subpath import with .ts file extension", async () => {
    const { subpathWithTsExt } = await import("./subpath/subpathWithTsExt.js");

    assert.equal(subpathWithTsExt(), "hello world!");
  });
});
