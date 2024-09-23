import { SourceMapBackendReadError } from "../errors";
import { StorageBackend } from "../types";

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
