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
import process from 'process';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
interface EnvVarOptions {
    type: 'envVar';
    envVarName: string;
}

interface HTTPOptions {
    type: 'http';
    url: string;
}

type StorageOptions = EnvVarOptions | HTTPOptions

// Interface for Source Map Storage/Retrieval
class BaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BaseError';
    }
}

class SourceMapGenError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'SourceMapGenError';
    }
}

class SourceMapBackendStoreError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'SourceMapStoreError';
    }
}
class SourceMapBackendReadError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'SourceMapReadError';
    }
}

// Interface for Source Map Generators
abstract class SourceMapGenerator {
    /**
     * Generate source maps from a given root directory or source map file.
     * This creates a regular javascript object where the keys are module names.
     * @param source A string that can be a root directory or a path to a source map file.
     */
    abstract generate(source: string): Promise<Record<string, string>>;
}

// Concrete Generator Implementations
class FileSystemGenerator extends SourceMapGenerator {
    async generate(rootDir: string): Promise<Record<string, string>> {
        try {
            const moduleMap: Record<string, string> = {};
            const moduleNameToFilePath: Record<string, string[]> = {};

            function traverseDirectory(directory: string) {
                const files = fs.readdirSync(directory);
                for (const file of files) {
                    const filePath = path.join(directory, file);
                    const fileStat = fs.statSync(filePath);
                    if (fileStat.isDirectory()) {
                        traverseDirectory(filePath);
                    } else if (fileStat.isFile()) {
                        const moduleName = path.relative(rootDir, filePath).replace(/\\/g, '/').replace(/\.[^/.]+$/, '');
                        moduleNameToFilePath[moduleName] = moduleNameToFilePath[moduleName] || [];
                        moduleNameToFilePath[moduleName].push(filePath);
                    }
                }
            }

            traverseDirectory(rootDir);

            for (const [moduleName, filePaths] of Object.entries(moduleNameToFilePath)) {
                moduleMap[moduleName] = filePaths[0];
            }
            return moduleMap;
        } catch (error) {
            console.error("Error generating source map from file system:", error);
            throw new SourceMapGenError("Error generating source map from file system");
        }
    }
}

class SourceMapFileGenerator extends SourceMapGenerator {
    async generate(mapPath: string): Promise<Record<string, string>> {
        try {
            // ... implementation to read source maps from a file ...
            return await Promise.resolve({});
        } catch (error) {
            console.error("Error generating source map from file:", error);
            throw new SourceMapGenError("Error generating source map from file");
        }
    }
}

// Interface for Source Map Storage/Retrieval
abstract class StorageBackend {
    abstract store(map: Record<string, string>, options: StorageOptions): Promise<void>;
    abstract read(options: StorageOptions): Promise<Record<string, string>>;
}

// Concrete Store Implementations
class EnvVarBackend extends StorageBackend {
    async store(map: Record<string, string>, options?: Record<string, any>): Promise<void> {
        const envVarName = options?.envVarName || 'MODULE_MAP';
        try {
            // ... implementation to store in an environment variable ...
            process.env[envVarName] = JSON.stringify(map);
        } catch (error) {
            console.error("Error storing source map in environment variable:", error);
            throw new SourceMapBackendStoreError("Error storing source map in environment variable");
        }
    }

    async read(options?: Record<string, any>): Promise<Record<string, string>> {
        const envVarName = options?.envVarName || 'MODULE_MAP';
        try {
            // ... implementation to read from an environment variable ...
            const mapString = process.env[envVarName];
            return mapString ? JSON.parse(mapString) : {};
        } catch (error) {
            console.error("Error reading source map from environment variable:", error);
            throw new SourceMapBackendReadError("Error reading source map from environment variable");
        }
    }
}

class DynamicImportBackend extends StorageBackend {
    // ... implementation to use dynamic imports ...
    async store(map: Record<string, string>): Promise<void> {
        try {
            // ... Implementation to store for dynamic import ...
        } catch (error) {
            console.error("Error storing source map for dynamic import:", error);
            throw error; // Or handle differently
        }
    }
    async read(): Promise<Record<string, string>> {
        try {
            // ... Implementation to read from dynamic import ...
            return await Promise.resolve({});
        } catch (error) {
            console.error("Error reading source map from dynamic import:", error);
            throw new SourceMapBackendReadError("Error reading source map from dynamic import");
        }
    }
}

class HTTPBackend extends StorageBackend {
    private urls: Record<string, string> = {};

    async store(map: Record<string, string>, options?: Record<string, any>): Promise<void> {
        const identifier = options?.identifier;
        const url = options?.url;
        if (!identifier || !url) {
            throw new Error("Identifier and URL must be provided for HTTPBackend.store().");
        }
        if (this.urls[identifier]) {
            throw new Error(`A source map with identifier '${identifier}' already exists.`);
        }
        try {
            // ... Implementation to store via HTTP using the provided url ...
            this.urls[identifier] = url;
        } catch (error) {
            console.error(`Error storing source map with identifier '${identifier}' to ${url}:`, error);
            throw error;
        }
    }

    async read(options?: Record<string, any>): Promise<Record<string, string>> {
        const identifier = options?.identifier;
        if (!identifier) {
            throw new Error("Identifier must be provided for HTTPBackend.read().");
        }
        const url = this.urls[identifier];
        if (!url) {
            throw new Error(`No URL found for source map identifier '${identifier}'.`);
        }
        try {
            const result = await fetch(url).then((response) => response.json()) as Record<string, string>;
            return result;
        } catch (error) {
            console.error(`Error reading source map with identifier '${identifier}' from ${url}:`, error);
            throw new SourceMapBackendReadError(`Error reading source map from ${url}`);
        }
    }
}

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
}

export {
    SourceMapManager,
    FileSystemGenerator,
    SourceMapFileGenerator,
    EnvVarBackend,
    DynamicImportBackend,
    HTTPBackend,
};
