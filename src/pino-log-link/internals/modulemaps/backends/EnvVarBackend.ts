import { SourceMapBackendStoreError, SourceMapBackendReadError } from "../errors";
import ModuleMap, { EnvVarOptions } from "../types";
import { AbstractStorageBackend } from "./AbstractStorageBackend";
import getMapFromEnv from "./getMapFromEnv";
import storeMapInEnv from "./storeMapInEnv";

// Concrete Store Implementations
export default class EnvVarBackend extends AbstractStorageBackend {
    DEFAULT_ENV_VAR_NAME = 'MODULE_MAP';
    envVarName: string;
    constructor(options: EnvVarOptions) {
        super(options);
        this.envVarName = options.envVarName || this.DEFAULT_ENV_VAR_NAME;
    }

    async store(map: ModuleMap): Promise<void> {

        try {
            // ... implementation to store in an environment variable ...
            storeMapInEnv(map, this.envVarName);
        } catch (error) {
            console.error("Error storing source map in environment variable:", error);
            throw new SourceMapBackendStoreError("Error storing source map in environment variable");
        }
    }

    async fetch(options?: EnvVarOptions): Promise<ModuleMap> {

        try {
            return getMapFromEnv(this.envVarName);
        } catch (error) {
            console.error("Error reading source map from environment variable:", error);
            throw new SourceMapBackendReadError("Error reading source map from environment variable");
        }
    }
}
