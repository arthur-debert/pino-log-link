// Interface for Source Map Generators

import ModuleMap from "./types";


/**
 * AbstractSourceMapGenerator is an interface for classes that generate source maps.
 * The class should be initialized with all the necessary information to generate the source maps.
 *
 * Subclasses must implement the generate method which should return a
 * Promise<MapModule>
 */
export abstract class AbstractSourceMapGenerator {
    source: string;
    /**
     * Generate source maps from a given root directory or source map file.
     * This creates a regular javascript object where the keys are module names.
     * @param source A string that can be a root directory or a path to a source map file.
     */
    constructor(source: string) {
        this.source = source;
    }
    abstract generate(): Promise<ModuleMap>;
}
