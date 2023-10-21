import { extname, resolve as resolvePath } from "node:path";
import { env } from "node:process";
import { fileURLToPath } from "node:url";
import { transform } from "esbuild";
import { createFilesMatcher, getTsconfig, parseTsconfig } from "get-tsconfig";

const replaceJsExt = (specifier) =>
  specifier.replace(/\.(js|mjs)(\?.*)?$/, (_, ext, query = "") => {
    return ext === "mjs" ? ".mts" + query : ".ts" + query;
  });

export async function resolve(specifier, context, nextResolve) {
  const ext = extname(specifier);

  if (
    ext.startsWith(".js") ||
    ext.startsWith(".mjs") ||
    specifier.startsWith("#")
  ) {
    try {
      return await nextResolve(specifier, context);
    } catch (error) {
      if (error.code === "ERR_MODULE_NOT_FOUND") {
        return nextResolve(replaceJsExt(error.url), context);
      }

      throw error;
    }
  }

  return nextResolve(specifier, context);
}

const tsconfig = env.TSXFM_TSCONFIG_PATH
  ? {
      path: resolvePath(env.TSXFM_TSCONFIG_PATH),
      config: parseTsconfig(env.TSXFM_TSCONFIG_PATH),
    }
  : getTsconfig();

const tsconfigFilesMatcher = tsconfig && createFilesMatcher(tsconfig);

export async function load(url, context, nextLoad) {
  const ext = extname(url);

  if (ext.startsWith(".ts") || ext.startsWith(".mts")) {
    const { source } = await nextLoad(url, { ...context, format: "module" });

    const filePath = fileURLToPath(url);

    const transformedSource = await transform(source.toString(), {
      target: "esnext",
      loader: "ts",
      tsconfigRaw: tsconfigFilesMatcher
        ? tsconfigFilesMatcher(filePath)
        : undefined,
      sourcemap: "inline",
      sourcefile: filePath,
      sourcesContent: (env.NODE_ENV ?? "development") !== "production",
    });

    return {
      format: "module",
      shortCircuit: true,
      source: transformedSource.code,
    };
  }

  return nextLoad(url, context);
}
