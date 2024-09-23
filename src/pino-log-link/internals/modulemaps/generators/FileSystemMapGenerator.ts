import { SourceMapGenError } from "../errors";
import ModuleMap from "../types";
import { AbstractSourceMapGenerator } from "../AbstractSourceMapGenerator";
import generateMapFromFS from "./generateMapFromFS";

const DEFAULT_INCLUDE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.mts', '.cts']
// Concrete Generator Implementations
export default class FileSystemGenerator extends AbstractSourceMapGenerator {
    async generate(): Promise<ModuleMap> {
        try {
            return generateMapFromFS(this.source, DEFAULT_INCLUDE_EXTENSIONS)
        } catch (error) {
            console.error("Error generating source map from file system:", error);
            throw new SourceMapGenError("Error generating source map from file system");
        }
    }
}