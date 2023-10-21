# tsxfm

> Teaching Node.js to dance with TypeScript – Module hooks unleashed!

tsxfm is short for TypeScript transform. It provides minimal [Node.js module hooks](https://nodejs.org/dist/latest/docs/api/module.html#customization-hooks) to transform TypeScript files on-the-fly with esbuild. Uncompromisingly ESM!

## Install

```
npm install -D tsxfm esbuild
```

Note: esbuild is specified as a peer dependency of tsxfm and is therefore installed separately, giving you control over which version of esbuild you want to use and when you want to upgrade it.

## Usage

Run your scripts as usual with Node.js, but specify a `--import` flag to load tsxfm before the script is executed:

```
node --import tsxfm ./your-script.ts
```

For watch mode, we simply pass the `--watch` flag, which is built right into Node.js:

```
node --watch --import tsxfm ./your-script.ts
```

You can also use it in your npm scripts!

## Requirements

tsxfm requires Node.js 20+ and that your project is written with ES Modules. This means that you must either specify `"type": "module"` in your package.json or use `.mts` file extensions.

It is also strongly recommended to use TypeScript 5.2+ with the following settings included in your tsconfig.json file to ensure that your project fully follows the modern Node.js ES Modules resolution rules:

```jsonc
{
  /* Set the module system for the program to reflect Node's native ES Modules support. */
  "module": "NodeNext",
  /* Do not transform or elide any imports or exports not marked as type-only, ensuring they are written in the output file's format based on the 'module' setting. */
  "verbatimModuleSyntax": true
}
```

## FAQ

### How do I configure this?

The tsxfm tool is designed to be straightforward and minimalistic, and as such, it does not introduce any additional configuration options of its own.

By default, tsxfm attempts to locate a `tsconfig.json` file starting from the current working directory. When found, it uses the configuration options defined in the tsconfig and shares them with esbuild. It's important to note that not all tsconfig options have a direct impact on the transformation process. For specific details on which options are respected and how they affect the transformation process, please refer to the [esbuild documentation](https://esbuild.github.io/content-types/#tsconfig-json).

If tsxfm cannot automatically locate your tsconfig.json file, you can define the `TSXFM_TSCONFIG_PATH` environment variable. This variable lets you explicitly set the path to your TypeScript configuration file relative to the current working directory.

### How should I create module path mappings?

In your project, it's recommended to adopt [Node.js subpath imports](https://nodejs.org/api/packages.html#subpath-imports) configured in your package.json. These subpath imports are natively supported by Node.js, TypeScript, esbuild and similar build tools.

This preference for subpath imports over TypeScript path mappings is driven by the original design of the paths feature. Paths in TypeScript serve to describe module mappings that are expected to already be handled by the targeted runtime. This design encourages the use of imports that Node.js natively understands.

As a practical implication, tsxfm (like [ts-node](https://typestrong.org/ts-node/docs/paths#why-is-this-not-built-in-to-ts-node)) adheres to this design philosophy and does not alter Node.js' module resolution behavior to implement TypeScript paths mappings. By adopting subpath imports in your package.json, you ensure that your project seamlessly integrates with the broader Node.js ecosystem.

### How is `tsxfm` different from [`tsx`](https://github.com/esbuild-kit/tsx)?

tsx is great! It's very keen on facilitating interoperability between ESM and CJS and support for older Node.js versions by hiding many of the differences. It therefore has a lot of transpiling rules under the hood to make your code run in all possible combinations. As a result, it can be a bit difficult to understand what code will actually end up in your Node.js runtime. On the other hand, tsxfm does none of this. It requires modern code that follows all the new stricter Node.js module resolution rules under ESM. TypeScript to JavaScript transformation only erases types and does not perform any other kind of transpilation.

### Does it do type-checking?

No, esbuild does not support type checking. It's recommended to run TypeScript separately via `tsc --noEmit`.
