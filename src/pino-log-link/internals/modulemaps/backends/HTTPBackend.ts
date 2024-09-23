import ModuleMap from "../types";
import fetch from "node-fetch";
import { SourceMapBackendReadError } from "../errors";
import { StorageOptions, HTTPOptions } from "../types";
import { AbstractStorageBackend } from "./AbstractStorageBackend";
import getMapFromHTTPRequest from "./getMapFromHTTPRequest";

export function validateHTTPOptions(options?: HTTPOptions) {
    if (!options) {
        throw new Error("Options must be provided for HTTPBackend.");
    }
    // check if options has a type and if it is 'http'
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

export default class HTTPBackend extends AbstractStorageBackend {
    private urls: ModuleMap = {};

    async store(map: ModuleMap, options?: HTTPOptions): Promise<void> {
        const { identifier, url } = validateHTTPOptions(options);
        this.urls[identifier] = url;
    }

    async fetch(options?: HTTPOptions): Promise<ModuleMap> {
        const { identifier } = validateHTTPOptions(options);
        const url = this.urls[identifier];
        return Promise.resolve(getMapFromHTTPRequest(url))
    }
}
