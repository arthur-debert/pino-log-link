import fs from "fs";
import { join } from "path";
import ModuleMap from "../types"

export function processSourceMap(content: string): ModuleMap {
    const lines = content.split("\n");
    const moduleMap: ModuleMap = {};
    for (const line of lines) {
        const [modulePath, moduleName] = line.split(" ");
        if (modulePath && moduleName) {
            moduleMap[moduleName] = modulePath;
        }
    }
    return moduleMap;
}
/**
 * Generates a ModuleMap from a path with source maps.
 * Uses processSourceMap to process the source maps.
 * @param sourceMapPath The path to the source maps, can be a source map file or a directory containing source maps.
 * @param fs    The file system provider to use. Defaults to the Node.js file system. Can be changed for testing.
 * @returns A ModuleMap object where the key is the module name and the value is the path to the module.
 */
export default async function generateMapFromSourceMaps(sourceMapPath: string, fsProvider: any = fs): Promise<ModuleMap> {
    const moduleMap: ModuleMap = {};
    if (!fsProvider.existsSync(sourceMapPath)) {
        throw new Error(`Source map path does not exist: ${sourceMapPath}`);
    }
    const isDirectory = fsProvider.lstatSync(sourceMapPath).isDirectory();
    if (isDirectory) {
        const files = fsProvider.readdirSync(sourceMapPath);
        for (const file of files) {
            const filePath = join(sourceMapPath, file);
            if (fsProvider.lstatSync(filePath).isFile()) {
                const content = fsProvider.readFileSync(filePath, "utf-8");
                Object.assign(moduleMap, processSourceMap(content));
            }
        }
    } else {
        const content = fsProvider.readFileSync(sourceMapPath, "utf-8");
        Object.assign(moduleMap, processSourceMap(content));
    }
    return moduleMap;
}

