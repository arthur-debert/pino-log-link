// Interface for Source Map Storage/Retrieval
class BaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BaseError';
    }
}
export class NetworkError extends BaseError {
    url: string
    cause: Error;
    constructor(message: string, url: string, options?: any) {
        super(message);
        this.name = 'NetworkError';
        this.url = url
        this.cause = options?.cause;
    }
    toString() {
        return `${this.name}: ${this.url} (HTTP Code: ${this.message})`;
    }
}
export class SourceMapGenError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'SourceMapGenError';
    }
}
export class SourceMapBackendStoreError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'SourceMapStoreError';
    }
}

export class InvalidModuleMapError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidModuleMapError';
    }
}

export class InvalidModuleMapSerializationError extends InvalidModuleMapError {
    // The text that could not be parsed as JSON
    rawText: string;

    constructor(message: string, rawText: string) {
        super(message);
        this.name = 'InvalidModuleMapSerializationError';
        this.rawText = rawText;
    }
    toString() {
        return `${this.name}: ${this.message}, ${this.rawText}`;
    }
}

export class HttpError extends BaseError {
    statusCode: number;
    constructor(message: string, code: number) {
        super(message);
        this.name = 'HTTPError';
        this.statusCode = code;
    }
    toString() {
        return `${this.name}: ${this.statusCode} (HTTP Code: ${this.message})`;
    }
}

export class SourceMapBackendReadError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'SourceMapReadError';
    }
}
