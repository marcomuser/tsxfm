import process from "node:process";
import { fileURLToPath } from "node:url";
import { transform } from "esbuild";

export async function resolve(specifier, context, nextResolve) {
  if (jsExtensionsRegex.test(specifier)) {
    try {
      return await nextResolve(specifier, context);
    } catch (error) {
      if (error.code === "ERR_MODULE_NOT_FOUND") {
        return nextResolve(jsSpecifierReplacer(specifier), context);
      }

      throw error;
    }
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (tsExtensionsRegex.test(url)) {
    const { source } = await nextLoad(url, { ...context, format: "module" });

    const transformedSource = await transform(source.toString(), {
      target: "esnext",
      loader: "ts",
      tsconfigRaw: `{"compilerOptions":{"verbatimModuleSyntax":true}}`,
      sourcemap: "inline",
      sourcefile: fileURLToPath(url),
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

const jsExtensionsRegex = /\.(js|mjs)$/;
const tsExtensionsRegex = /\.(ts|mts)$/;

const jsSpecifierReplacer = (specifier) =>
  specifier.replace(jsExtensionsRegex, (_, extension) => {
    return extension === "mjs" ? ".mts" : ".ts";
  });
