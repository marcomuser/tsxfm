import { describe, it } from "node:test";
import assert from "node:assert/strict";

await import("#tsxfm");

describe("ts transform", async () => {
  it("transforms hello world typescript function", async () => {
    const { helloWorld } = await import("./fixtures/helloWorld.js");

    assert.equal(helloWorld(), "hello world!");
  });

  it("resolves import with .js file extension", async () => {
    const { jsImport } = await import("./fixtures/jsImport.js");

    assert.equal(jsImport(), "hello world!");
  });

  it("resolves import with .ts file extension", async () => {
    const { tsImport } = await import("./fixtures/tsImport.js");

    assert.equal(tsImport(), "hello world!");
  });

  it("resolves deep import", async () => {
    const { deepImport } = await import("./fixtures/deepImport.js");

    assert.equal(deepImport(), "hello world!");
  });

  it("handles bare module specifier", async () => {
    const { prettifiedCode } = await import("./fixtures/prettifiedCode.js");

    assert.equal(await prettifiedCode(), `console.log("hello world!");\n`);
  });

  it("transforms module with .mts file extension", async () => {
    const { mts } = await import("./fixtures/mts/mts.mjs");

    assert.equal(mts(), "hello world!");
  });

  it("transforms subpath import with .js file extension", async () => {
    const { subpathWithJsExt } = await import(
      "./fixtures/subpath/subpathWithJsExt.js"
    );

    assert.equal(subpathWithJsExt(), "hello world!");
  });

  it("transforms subpath import with .ts file extension", async () => {
    const { subpathWithTsExt } = await import(
      "./fixtures/subpath/subpathWithTsExt.js"
    );

    assert.equal(subpathWithTsExt(), "hello world!");
  });

  it("transforms imports with search params", async () => {
    const { searchParams } = await import(
      // @ts-expect-error TypeScript 5.2 does not support this even though Node.js does
      "./fixtures/searchParams.js?hello=world"
    );

    assert.equal(searchParams(), "world");
  });
});
