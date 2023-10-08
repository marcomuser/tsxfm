# tsxfm

> Teaching Node.js to dance with TypeScript – Module hooks unleashed!

tsxfm is short for TypeScript transform. It provides minimal [Node.js module hooks](https://nodejs.org/dist/latest/docs/api/module.html#customization-hooks) to transform TypeScript files on-the-fly with esbuild. Uncompromisingly ESM!

## Install

```
npm install -D tsxfm esbuild
```

Note: Esbuild is specified as a peer dependency of tsxfm and is therefore installed separately, giving you control over which version of esbuild you want to use and when you want to upgrade it.

## Usage

Run your scripts as usual with Node.js, but specify a `--module` flag to load tsxfm before the script is executed:

```
node --module tsxfm ./your-script.ts
```

You can also use it in your npm scripts!

## Requirements

tsxfm requires Node.js 20+ and that your project is written with ES Modules. This means that you must either specify `"type": "module"` in your package.json or use `.mts` file extensions.

tsxfm also requires TypeScript 5.2+ and your tsconfig.json to include the following settings to ensure that the project fully follows the modern Node.js ES Modules resolution rules:

```jsonc
{
  /* Specify what module code is generated. */
  "module": "NodeNext",
  /* Ensure that each file can be safely transpiled without relying on other imports. */
  "isolatedModules": true,
  /* Do not transform or elide any imports or exports not marked as type-only, ensuring they are written in the output file's format based on the 'module' setting. */
  "verbatimModuleSyntax": true,
  /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
  "esModuleInterop": true
}
```

## FAQ

### How do I configure this?

You don't! tsxfm does not offer any configuration options.

### How do I do Subpath imports?

Use [Node.js subpath imports](https://nodejs.org/api/packages.html#subpath-imports) in your package.json. They are natively supported by Node.js, TypeScript, esbuild and similar build tools. Node.js subpath imports should be preferred over TypeScript paths mappings for the same reason [why ts-node](https://typestrong.org/ts-node/docs/paths#why-is-this-not-built-in-to-ts-node) does not natively support the latter.

### How is `tsxfm` different from [`tsx`](https://github.com/esbuild-kit/tsx)?

tsx is great! It's very keen on facilitating interoperability between ESM and CJS and support for older Node.js versions by hiding many of the differences. It therefore has a lot of transpiling rules under the hood to make your code run in all possible combinations. As a result, it can be a bit difficult to understand what code will actually end up in your Node.js runtime. On the other hand, tsxfm does none of this. It requires modern code that follows all the new stricter Node.js module resolution rules under ESM. TypeScript to JavaScript transformation only erases types and does not perform any other kind of transpilation.

### Does it do type-checking?

Same answer as for [tsx](https://github.com/esbuild-kit/tsx#does-it-do-type-checking): No, esbuild does not support type checking. It's recommended to run TypeScript separately as a command (`tsc --noEmit`) or via [IDE IntelliSense](https://code.visualstudio.com/docs/languages/typescript).
