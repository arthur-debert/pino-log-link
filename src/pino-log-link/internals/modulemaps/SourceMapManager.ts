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
// and the main logic for generating . storing and fecthing
import ModuleMap, { StorageOptions } from './types';
import { AbstractSourceMapGenerator } from "./AbstractSourceMapGenerator";
import { AbstractStorageBackend } from "./backends/AbstractStorageBackend";
import HTTPBackend from './backends/HTTPBackend';
import EnvVarBackend from './backends/EnvVarBackend';
import FileSystemGenerator from './generators/FileSystemMapGenerator';
import SourceMapMapGenerator from './generators/AbstractSourceMapGenerator';
import { SourceMapGenError, SourceMapBackendReadError, SourceMapBackendStoreError, InvalidModuleMapError, InvalidModuleMapSerializationError, HttpError, NetworkError } from './errors';


type ManagerStatus = 'empty' | 'generated' | 'ready';

/**
 * SourceMapManager manages the generation and storage of source maps.
 *
 * It is a configurable , high-level class that combines a generator and a storage
 * backend to create and store source maps.
 * Both should be provided configured with their respective options, from them on
 * the manager will handle the generation and storage of the source maps.
 *
 * Both are async operations, so the manager is async as well.
 * Once the managers is fully inited, it can be used to resolve module names to file paths synchronously.
 * @param generator A class that extends `AbstrctSourceMapGenerator` and is used to generate source maps.
 * @param store A class that extends `AbstractStorageBackend` and is used to store the generated source maps.
 * @example
 * const manager = new SourceMapManager(FileSystemGenerator, EnvVarBackend);
 * const map =  await manager.generateAndStoreSourceMap('/path/to/root/dir', { envVarName: 'MODULE_MAP' }).then().read()
 */
class SourceMapManager {
    private generator: AbstractSourceMapGenerator;
    private store: AbstractStorageBackend;

    map: ModuleMap | undefined;
    status: ManagerStatus = 'empty'

    constructor(generator: AbstractSourceMapGenerator, store: AbstractStorageBackend
    ) {
        this.generator = generator;
        this.store = store;
    }

    async generateMap(): Promise<boolean> {
        try {
            const map = await this.generator.generate()
            this.map = map;
            this.status = 'generated';
            return Promise.resolve(true);
        } catch (error) {
            throw error; // Or handle differently
        }
    }
    async fetchMap(): Promise<ModuleMap> {
        try {
            this.map = await this.store.fetch();
            this.status = 'ready';
            return this.map;
        } catch (error) {
            console.error("Error in getStoredSourceMap:", error);
            throw error; // Or handle differently
        }
    }
    resolve(moduleName: string): string {
        if (this.status !== 'ready' || !this.map) {
            throw new Error('Source map not found!');
        }
        const unkown = 'not found!'
        return this.map[moduleName] as string || unkown;
    }
}
export {
    SourceMapManager,
    AbstractSourceMapGenerator as SourceMapGenerator,
    AbstractStorageBackend as StorageBackend,
    StorageOptions,
    HTTPBackend,
    EnvVarBackend,
    FileSystemGenerator,
    SourceMapMapGenerator,
    // Errors
    SourceMapGenError,
    SourceMapBackendReadError,
    SourceMapBackendStoreError,
    InvalidModuleMapError,
    InvalidModuleMapSerializationError,
    HttpError,
    NetworkError
};
