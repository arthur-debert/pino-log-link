import ModuleMap, { StorageOptions } from "../types";

// Interface for Source Map Storage/Retrieval
export abstract class AbstractStorageBackend {
    options: StorageOptions;
    constructor(options: StorageOptions) {
        this.options = options;
    }
    abstract store(map: ModuleMap): Promise<void>;
    abstract fetch(): Promise<ModuleMap>;
}
