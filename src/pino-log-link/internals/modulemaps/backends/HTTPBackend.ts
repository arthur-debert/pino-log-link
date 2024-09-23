import fetch from "node-fetch";
import { SourceMapBackendReadError } from "../errors/errors";
import { StorageBackend } from "../types";

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
