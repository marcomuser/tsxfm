import { extname } from "node:path";
import { env } from "node:process";
import { fileURLToPath } from "node:url";
import { transform } from "esbuild";

export async function resolve(specifier, context, nextResolve) {
  const ext = extname(specifier);

  if (ext.startsWith(".js") || ext.startsWith(".mjs")) {
    try {
      return await nextResolve(specifier, context);
    } catch (error) {
      if (error.code === "ERR_MODULE_NOT_FOUND") {
        return nextResolve(replaceJsExt(specifier), context);
      }

      throw error;
    }
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  const ext = extname(url);

  if (ext.startsWith(".ts") || ext.startsWith(".mts")) {
    const { source } = await nextLoad(url, { ...context, format: "module" });

    const transformedSource = await transform(source.toString(), {
      target: "esnext",
      loader: "ts",
      tsconfigRaw: `{"compilerOptions":{"verbatimModuleSyntax":true}}`,
      sourcemap: "inline",
      sourcefile: fileURLToPath(url),
      sourcesContent: (env.NODE_ENV ?? "development") !== "production",
    });

    return {
      format: "module",
      shortCircuit: true,
      source: transformedSource.code,
    };
  }

  return nextLoad(url);
}

const replaceJsExt = (specifier) =>
  specifier.replace(/\.(js|mjs)(\?.*)?$/, (_, ext, query = "") => {
    return ext === "mjs" ? ".mts" + query : ".ts" + query;
  });
