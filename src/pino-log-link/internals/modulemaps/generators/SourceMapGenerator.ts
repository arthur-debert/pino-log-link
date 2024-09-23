import fs from "fs";
import ModuleMap, { SourceMapGenerator } from "../types";
import generateMapFromSourceMaps from "./generateMapFromSourceMaps";
import { SourceMapGenError } from "../errors";

export default class SourceMapMapGenerator extends SourceMapGenerator {
    async generate(mapPath: string, fsProvider: any = fs): Promise<ModuleMap> {
        try {
            // ... implementation to read source maps from a file ...
            const map = await generateMapFromSourceMaps(mapPath, fsProvider);
            return await Promise.resolve(map);
        } catch (error) {
            console.error("Error generating source map from file:", error);
            throw new SourceMapGenError("Error generating source map from file");
        }
    }
}
