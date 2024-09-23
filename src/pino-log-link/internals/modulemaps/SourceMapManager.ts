/**
 * @module SourceMapManager
 *
 * This module provides a `SourceMapManager` class for generating, storing, and retrieving source maps.
 * It supports different storage backends, including environment variables, HTTP, and (potentially) dynamic imports.
 *
 * The `SourceMapManager` is designed to be flexible and extensible, allowing developers to easily add new source map
 * generation methods and storage mechanisms.
 *
 * All the concrete implementations for source map generation and storage are
 * in external functions, in order to make the `SourceMapManager` class more focused
 * and those particular implementations easier to test.
 *
 * General usage:
 * ```typescript
const storeOptions: StoreOptions = { type: 'envVar', envVarName: 'MODULE_MAP' };
const manager = new SourceMapManager(new FileSystemGenerator(), new EnvVarBackend());

(async () => {
    try {
        const map = await manager.generateAndStoreSourceMap(storeOptions);
        const config = pinoLogLink(fromModuleToFileURL, map, baseUrl);
        const logger = pino(config);
    } catch (error) {
        console.error('Error setting up logger:', error);
    }
})();
 */
import * as fs from 'fs';
import * as path from 'path';
// and the main logic for generating . storing and fecthing
import sourceMapGenFromFS from './generators/generateMapFromFS';
import ModuleMap, { SourceMapGenerator, StorageBackend, StorageOptions } from './types';
import generateMapFromSourceMaps from './generators/generateMapFromSourceMaps';
import { SourceMapGenError } from './errors/errors';


// Define specific types for type safety
type SourceMapGeneratorConstructor = new () => SourceMapGenerator;
type SourceMapBackendConstructor = new () => StorageBackend;

/**
 * SourceMapManager manages the generation and storage of source maps.
 * @example
 * const manager = new SourceMapManager(FileSystemGenerator, EnvVarBackend);
 * const map =  await manager.generateAndStoreSourceMap('/path/to/root/dir', { envVarName: 'MODULE_MAP' }).then().read()
 */
class SourceMapManager {
    private generator: SourceMapGenerator;
    private store: StorageBackend;

    map: ModuleMap | undefined;
    constructor(
        Generator: SourceMapGeneratorConstructor,
        Store: SourceMapBackendConstructor
    ) {
        this.generator = new Generator();
        this.store = new Store();
    }

    async generateAndStoreSourceMap(
        source: string,
        options?: StorageOptions // Use StorageOptions type for options parameter
    ): Promise<boolean> {
        try {
            const map = await this.generator.generate(source);
            if (options) {
                await this.store.store(map, options);
            } else {
                throw new Error("Options must be provided for storing the source map.");
            }
            return true;
        } catch (error) {
            console.error("Error in generateAndStoreSourceMap:", error);
            throw error;
        }
    }

    async getStoredSourceMap(options: StorageOptions): Promise<Record<string, string>> {
        try {
            return await this.store.read(options);
        } catch (error) {
            console.error("Error in getStoredSourceMap:", error);
            throw error; // Or handle differently
        }
    }
    sourceMapResolve(moduleName: string): string {
        if (!this.map) {
            throw new Error('Source map not found!');
        }
        const unkown = 'not found!'
        return this.map[moduleName] || unkown;
    }
}
