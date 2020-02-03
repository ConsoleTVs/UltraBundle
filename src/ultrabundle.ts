import {
    rollup,
    watch,
    RollupOptions,
    OutputOptions,
    Plugin,
    RollupWatcher
} from 'rollup'
import { UltraBundleFlags } from './flags'
import { UltraBundleConfig } from './config'
import path from 'path'
import chalk from 'chalk'

// Rollup plugins
import gzip from 'rollup-plugin-gzip'
// @ts-ignore
import babel from 'rollup-plugin-babel'
// @ts-ignore
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'

// Default extensions to look for.
import { DEFAULT_EXTENSIONS } from '@babel/core'
const extensions = [...DEFAULT_EXTENSIONS, '.ts', '.tsx']

// Store the statuses for the builder.
const status = {
    building: (input: string) => chalk.yellow(`~> Bundling ${input}`),
    created: (output: string, duration: number) =>
        chalk.green(`~> Created ${output} [${duration} ms]`)
}

/**
 * Represents a bundle.
 *
 * @export
 * @class UltraBundle
 */
export class Bundle {
    /**
     * Represents the flags of the command line app.
     *
     * @type {UltraBundleFlags}
     * @memberof Bundle
     */
    readonly flags: UltraBundleFlags

    /**
     * Represents the configuration of the bundler.
     *
     * @type {UltraBundleConfig}
     * @memberof Bundle
     */
    readonly config: UltraBundleConfig

    /**
     * Stores the package.json information.
     *
     * @type {JSON}
     * @memberof Bundle
     */
    readonly packageJSON: { [key: string]: any }

    /**
     * Creates an instance of UltraBundle.
     *
     * @param {UltraBundleFlags} flags
     * @param {UltraBundleConfig} config
     * @memberof Bundle
     */
    constructor(
        flags: UltraBundleFlags,
        config: UltraBundleConfig,
        packageJSON: { [key: string]: any }
    ) {
        this.flags = flags
        this.config = config
        this.packageJSON = packageJSON
    }

    /**
     * Gets the output options for rollup given the output config.
     *
     * @param {OutputConfig} { file }
     * @returns {OutputOptions}
     * @memberof Bundle
     */
    get outputOptions(): OutputOptions {
        return {
            file: this.config.output,
            sourcemap: this.config.sourcemap,
            format: this.config.format,
            name: this.packageJSON?.name ?? 'bundle',
            globals: this.config.globals
        }
    }

    /**
     * Returns the optimizations to apply by babel.
     *
     * @readonly
     * @type {string[]}
     * @memberof Bundle
     */
    get babelOptimizations(): string[] {
        if (!this.flags.optimize || !this.config.optimizations.simplify)
            return []
        return [
            'minify-constant-folding',
            'minify-simplify',
            'transform-minify-booleans',
            'minify-numeric-literals',
            'transform-inline-consecutive-adds',
            'transform-merge-sibling-variables',
            'minify-guarded-expressions',
            'minify-infinity',
            'minify-mangle-names',
            'minify-type-constructors',
            '@babel/plugin-transform-property-literals',
            'transform-undefined-to-void'
        ]
    }

    /**
     * Returns the input options for rollup.
     *
     * @readonly
     * @type {RollupOptions}
     * @memberof Bundle
     */
    get inputOptions(): RollupOptions {
        return {
            input: this.config.input,
            external: this.config.external,
            treeshake: this.flags.optimize
                ? this.config.optimizations.dead_code_elimination
                : false,
            plugins: [
                this.isTypescript() &&
                    typescript({
                        useTsconfigDeclarationDir: true,
                        tsconfigDefaults: {
                            compilerOptions: {
                                moduleResolution: 'node',
                                declaration: true,
                                types: [],
                                declarationDir:
                                    path.dirname(this.config.output) + '/types',
                                isolatedModules: true,
                                esModuleInterop: true,
                                strict: true,
                                experimentalDecorators: true,
                                emitDecoratorMetadata: true,
                                forceConsistentCasingInFileNames: true,
                                allowSyntheticDefaultImports: true
                            }
                        },
                        tsconfigOverride: {
                            compilerOptions: { module: 'esnext' }
                        }
                    }),
                postcss(),
                resolve({ extensions }),
                commonjs({ include: 'node_modules/**' }),
                babel({
                    babelrc: false,
                    extensions,
                    exclude: 'node_modules/**',
                    presets: [['@babel/env', { modules: false }]],
                    plugins: [
                        '@babel/plugin-proposal-class-properties',
                        '@babel/plugin-proposal-object-rest-spread',
                        '@babel/plugin-proposal-nullish-coalescing-operator',
                        '@babel/plugin-proposal-optional-chaining',
                        ...this.babelOptimizations
                    ]
                }),
                ...this.optimizations
            ]
        }
    }

    /**
     * Gets the optimizations to apply.
     *
     * @readonly
     * @type {Plugin[]}
     * @memberof Bundle
     */
    get optimizations(): Plugin[] {
        if (!this.flags.optimize) return []
        return [
            // Minifies the output generated.
            ...(this.config.optimizations.minify ? [terser()] : []),
            // Creates a gzipped version to serve if needed.
            ...(this.config.optimizations.gzip ? [gzip()] : [])
        ]
    }

    /**
     * Determines if the bundle is typescript.
     *
     * @returns {boolean}
     * @memberof Bundle
     */
    isTypescript(): boolean {
        return this.config.input?.endsWith('.ts') ?? false
    }

    watch() {
        const watcher = watch([
            {
                ...this.inputOptions,
                output: this.outputOptions,
                watch: {
                    clearScreen: false,
                    exclude: ['node_modules/**']
                }
            }
        ])
        watcher.on('event', e => {
            switch (e.code) {
                case 'BUNDLE_START': {
                    console.log(status.building(this.config.input))
                    break
                }
                case 'BUNDLE_END': {
                    console.log(status.created(this.config.output, e.duration))
                    break
                }
            }
        })
        return watcher
    }

    /**
     * Bundles the application or library into the desired output.
     *
     * @memberof Bundle
     */
    async bundle(): Promise<RollupWatcher | undefined> {
        if (this.flags.watch) return this.watch()
        console.log(status.building(this.config.input))
        const begin = Date.now()
        const bundle = await rollup(this.inputOptions)
        await bundle.write(this.outputOptions)
        console.log(status.created(this.config.output, Date.now() - begin))
    }
}

/**
 * Represents the base UltraBundle class.
 *
 * @export
 * @class UltraBundle
 */
export class UltraBundle {
    /**
     * Stores the bundles of the application or library.
     *
     * @type {Bundle[]}
     * @memberof UltraBundle
     */
    readonly bundles: Bundle[]

    /**
     * Creates an instance of UltraBundle.
     *
     * @param {Bundle[]} bundles
     * @memberof UltraBundle
     */
    constructor(bundles: Bundle[]) {
        this.bundles = bundles
    }

    /**
     * Bundles all the bundles of the application or
     * library. The promise is complete when all of
     * the bundles finishes.
     *
     * @returns
     * @memberof UltraBundle
     */
    async bundle() {
        for (const bundle of this.bundles) await bundle.bundle()
    }
}
