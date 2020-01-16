#!/usr/bin/env node

import fs from 'fs'
import merge from 'deepmerge'
import {
    UltraBundleFlags,
    defaultFlags,
    UltraBundleConfig,
    UltraBundle,
    Bundle,
    defaultConfig
} from '../'

/**
 * Main entry point of the application
 */
async function main() {
    // Helper to warn a message into the console.
    const warn = (message: string) => console.warn(`[WARNING] ${message}`)

    // Check the options of the command line app.
    // This makes a shallow copy with the default values.
    const flags: UltraBundleFlags = { ...defaultFlags }
    const args = process.argv.slice(2)
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--config': {
                if (i + 1 >= args.length) {
                    warn('The --config setting require an argument afterwards')
                    break
                }
                flags.config = args[++i]
                break
            }
            case '--packageJSON': {
                if (i + 1 >= args.length) {
                    warn(
                        'The --packageJSON setting require an argument afterwards'
                    )
                    break
                }
                flags.packageJSON = args[++i]
                break
            }
            case '--watch': {
                flags.watch = true
                break
            }
            case '--optimize': {
                flags.optimize = true
                break
            }
        }
    }

    // Build the configuration of UltraBundle.
    const config: UltraBundleConfig[] = JSON.parse(
        fs.readFileSync(flags.config, { encoding: 'UTF-8' })
    ).map((e: UltraBundleConfig) => merge(defaultConfig, e))

    // Get the package.json information.
    const packageJSON: { [key: string]: any } = JSON.parse(
        fs.readFileSync(flags.packageJSON, { encoding: 'UTF-8' })
    )

    // Create the bundler instance.
    const bundler = new UltraBundle(
        config.map(c => new Bundle(flags, c, packageJSON))
    )

    // Bundle the application.
    return await bundler.bundle()
}

main()
