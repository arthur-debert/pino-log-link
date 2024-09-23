import { SourceMapGenError } from "../errors";
import ModuleMap, { SourceMapGenerator } from "../types";
import generateMapFromFS from "./generateMapFromFS";

const DEFAULT_INCLUDE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.mts', '.cts']
// Concrete Generator Implementations
export default class FileSystemGenerator extends SourceMapGenerator {
    async generate(rootDir: string): Promise<ModuleMap> {
        try {
            return generateMapFromFS(rootDir, DEFAULT_INCLUDE_EXTENSIONS)
        } catch (error) {
            console.error("Error generating source map from file system:", error);
            throw new SourceMapGenError("Error generating source map from file system");
        }
    }
}