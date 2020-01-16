# UltraBundle

### An efficient and agressive bundler powered by rollup.

Well yes, this is another bundler, but honestly, a good one.

## Features

-   First class TypeScript support.
-   Lots of optimizations out of the box.
-   Simple single JSON file configuration.
-   Supports file watching.

## Install

```
npm i -D ultrabundle
```

## Use

1.  Create a file named `bundles.json` in the root of your application (where `package.json` is located).
2.  Paste in the configuration of the bundles.

```json
[
    {
        "input": "src/index.ts",
        "output": "dist/output.js"
    }
]
```

3.  Define 3 simple scripts in your `package.json`

```json
"dev": "ultrabundle",
"watch": "ultrabundle --watch",
"prod": "ultrabundle --optimize"
```
