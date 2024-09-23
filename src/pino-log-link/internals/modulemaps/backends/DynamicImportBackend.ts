import { SourceMapBackendReadError } from "../errors";
import ModuleMap from "../types";
import { AbstractStorageBackend } from "./AbstractStorageBackend";

class DynamicImportBackend extends AbstractStorageBackend {
    // ... implementation to use dynamic imports ...
    async store(map: ModuleMap): Promise<void> {
        try {
            // ... Implementation to store for dynamic import ...
        } catch (error) {
            console.error("Error storing source map for dynamic import:", error);
            throw error; // Or handle differently
        }
    }
    async fetch(): Promise<ModuleMap> {
        try {
            // ... Implementation to read from dynamic import ...
            return await Promise.resolve({});
        } catch (error) {
            console.error("Error reading source map from dynamic import:", error);
            throw new SourceMapBackendReadError("Error reading source map from dynamic import");
        }
    }
}
