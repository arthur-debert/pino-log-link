import { SourceMapBackendStoreError, SourceMapBackendReadError } from "../errors/errors";
import { StorageBackend } from "../types";
import getMapFromEnv from "./getMapFromEnv";
import storeMapInEnv from "./storeMapInEnv";

// Concrete Store Implementations
export default class EnvVarBackend extends StorageBackend {
    async store(map: Record<string, string>, options?: Record<string, any>): Promise<void> {
        const envVarName = options?.envVarName || 'MODULE_MAP';
        try {
            // ... implementation to store in an environment variable ...
            storeMapInEnv(map, envVarName);
        } catch (error) {
            console.error("Error storing source map in environment variable:", error);
            throw new SourceMapBackendStoreError("Error storing source map in environment variable");
        }
    }

    async read(options?: Record<string, any>): Promise<Record<string, string>> {

        const envVarName = options?.envVarName || 'MODULE_MAP';
        try {
            return getMapFromEnv(envVarName);
        } catch (error) {
            console.error("Error reading source map from environment variable:", error);
            throw new SourceMapBackendReadError("Error reading source map from environment variable");
        }
    }
}
