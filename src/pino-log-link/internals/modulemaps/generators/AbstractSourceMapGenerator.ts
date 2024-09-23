import fs from "fs";
import ModuleMap from "../types";
import generateMapFromSourceMaps from "./generateMapFromSourceMaps";
import { SourceMapGenError } from "../errors";


// Interface for Source Map


abstract class AbstractSourceMapGenerator {
    /**
     * Generate source maps from a given root directory or source map file.
     * This creates a regular javascript object where the keys are module names.
     * @param source A string that can be a root directory or a path to a source map file.
     */
    abstract generate(): Promise<ModuleMap>;
}
export default AbstractSourceMapGenerator