import process from "node:process";
import { transform } from "esbuild";

const tsExtensionsRegex = /\.(ts|mts)$/;

export async function load(url, context, nextLoad) {
  if (tsExtensionsRegex.test(url)) {
    const { source } = await nextLoad(url, { ...context, format: "module" });

    const transformedSource = await transform(source.toString(), {
      target: "esnext",
      loader: "ts",
      sourcemap: "inline",
      sourcesContent: (process.env.NODE_ENV ?? "development") !== "production",
    });

    return {
      format: "module",
      shortCircuit: true,
      source: transformedSource.code,
    };
  }

  return nextLoad(url);
}
