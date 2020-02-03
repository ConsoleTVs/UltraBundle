/**
 * Determines the optimization configuration.
 *
 * @export
 * @interface OptimizationsConfig
 */
export interface OptimizationsConfig {
    /**
     * Determines if the output is minified or not.
     *
     * @type {boolean}
     * @memberof OptimizationsConfig
     */
    minify: boolean

    /**
     * Determines if the output can be treeshaken to
     * remove dead code.
     *
     * @type {boolean}
     * @memberof OptimizationsConfig
     */
    dead_code_elimination: boolean

    /**
     * Determines if the bundle should optimize statements
     * and expressions found in the souce code.
     *
     * @type {boolean}
     * @memberof OptimizationsConfig
     */
    simplify: boolean

    /**
     * Determines if the output should generate a gzipped version
     * with the same name.
     *
     * @type {boolean}
     * @memberof OptimizationsConfig
     */
    gzip: boolean
}

/**
 * Determines the UltraBundle configuration JSON.
 *
 * @export
 * @interface UltraBundleConfig
 */
export interface UltraBundleConfig {
    /**
     * Represents the input file of the bundle.
     *
     * @type {string}
     * @memberof UltraBundleConfig
     */
    input: string

    /**
     * Represents the output of the bundler.
     *
     * @type {(OutputConfig | OutputConfig[])}
     * @memberof UltraBundleConfig
     */
    output: string

    /**
     * Determine the format of the output bundle.
     * Defaults to 'umd'.
     *
     * @type {("amd" | "cjs" | "commonjs" | "es" | "esm" | "iife" | "module" | "system" | "umd" | undefined)}
     * @memberof UltraBundleConfig
     */
    format:
        | 'amd'
        | 'cjs'
        | 'commonjs'
        | 'es'
        | 'esm'
        | 'iife'
        | 'module'
        | 'system'
        | 'umd'
        | undefined

    /**
     * Determine if the bundle should include a source map.
     *
     * @type {boolean}
     * @memberof UltraBundleConfig
     */
    sourcemap: boolean

    /**
     * Determines the optimizations applied to the output.
     *
     * @type {OptimizationsConfig}
     * @memberof UltraBundleConfig
     */
    optimizations: OptimizationsConfig

    /**
     * Determine the externals in rollup.
     *
     * @type {string[]}
     * @memberof UltraBundleConfig
     */
    external: string[]

    /**
     * Determine the output globals.
     *
     * @type {{ [key: string]: string }}
     * @memberof UltraBundleConfig
     */
    globals: { [key: string]: string }
}

/**
 * Determines the UltraBundle default configuration.
 *
 * @export
 * @var {defaultFlags}
 */
export const defaultConfig: UltraBundleConfig = {
    input: '',
    output: '',
    format: 'umd',
    sourcemap: false,
    external: [],
    globals: {},
    optimizations: {
        minify: true,
        dead_code_elimination: true,
        gzip: true,
        simplify: true
    }
}
