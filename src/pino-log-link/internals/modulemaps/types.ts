
// A simple map where the module name is the key and the value is the path to the module.


//  moduleName: pathToModule
type ModuleMap = Record<string, string>;
export default ModuleMap;
// Interface for Source Map Generators
export abstract class SourceMapGenerator {
    /**
     * Generate source maps from a given root directory or source map file.
     * This creates a regular javascript object where the keys are module names.
     * @param source A string that can be a root directory or a path to a source map file.
     */
    abstract generate(source: string): Promise<Record<string, string>>;
}
// Interface for Source Map Storage/Retrieval
export abstract class StorageBackend {
    abstract store(map: Record<string, string>, options: StorageOptions): Promise<void>;
    abstract read(options: StorageOptions): Promise<Record<string, string>>;
}
interface EnvVarOptions {
    type: 'envVar';
    envVarName: string;
}
interface HTTPOptions {
    type: 'http';
    url: string;
}

export type StorageOptions = EnvVarOptions | HTTPOptions;

