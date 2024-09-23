// Interface for Source Map Storage/Retrieval
class BaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BaseError';
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
export class SourceMapBackendReadError extends BaseError {
    constructor(message: string) {
        super(message);
        this.name = 'SourceMapReadError';
    }
}
