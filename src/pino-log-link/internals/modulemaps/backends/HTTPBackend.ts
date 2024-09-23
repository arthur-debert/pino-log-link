import fetch from "node-fetch";
import { SourceMapBackendReadError } from "../errors";
import { StorageBackend, StorageOptions } from "../types";
import getMapFromHTTPRequest from "./getMapFromHTTPRequest";

export function validateHTTPOptions(options?: StorageOptions): { identifier: string; url: string } {
    if (!options) {
        throw new Error("Options must be provided for HTTPBackend.");
    }
    if (options.type !== 'http') {
        throw new Error(`Invalid options type: ${options.type}. Expected 'http'.`);
    }
    const identifier = options.identifier;
    const url = options.url;
    if (!identifier || !url) {
        throw new Error("Identifier and URL must be provided for HTTPBackend.");
    }
    return { identifier, url };
}

export default class HTTPBackend extends StorageBackend {
    private urls: Record<string, string> = {};

    async store(map: Record<string, string>, options?: StorageOptions): Promise<void> {
        const { identifier, url } = validateHTTPOptions(options);
        this.urls[identifier] = url;
    }

    async read(options?: StorageOptions): Promise<Record<string, string>> {
        const { identifier } = validateHTTPOptions(options);
        const url = this.urls[identifier];
        return Promise.resolve(getMapFromHTTPRequest(url))
    }
}
