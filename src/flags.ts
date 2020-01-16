/**
 * Represents the UltraBundleFlags that can be used in the
 * UltraBundle CLI application.
 *
 * @export
 * @interface UltraBundleFlags
 */
export interface UltraBundleFlags {
    /**
     * Determines the path to the config file.
     *
     * @type {string}
     * @memberof UltraBundleFlags
     */
    config: string

    /**
     * Determines the path of the package.json file.
     *
     * @type {string}
     * @memberof UltraBundleFlags
     */
    packageJSON: string

    /**
     * Determines if UltraBundle should watch for
     * file changes and recompile if needed.
     *
     * @type {boolean}
     * @memberof UltraBundleFlags
     */
    watch: boolean

    /**
     * Determines if UltraBundle should optimize the
     * build using the optimizations provided.
     *
     * @type {boolean}
     * @memberof UltraBundleFlags
     */
    optimize: boolean
}

/**
 * Determines the UltraBundle default flags.
 *
 * @export
 * @var {defaultFlags}
 */
export const defaultFlags: UltraBundleFlags = {
    config: './bundles.json',
    packageJSON: './package.json',
    watch: false,
    optimize: false
}
