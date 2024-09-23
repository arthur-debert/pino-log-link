// Example build-time script (e.g., using Node.js)
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { findModuleFromSourceMap } from "./findModuleFromEnv"; // Adjust path

export default async function generateRuntimeModuleMap(
    sourceMapDir,
    outputFile
) {
    const moduleMap = {};
    const sourceMapFiles = readdirSync(sourceMapDir);

    for (const file of sourceMapFiles) {
        const sourceMapPath = join(sourceMapDir, file);
        const sourceMapContent = readFileSync(sourceMapPath, "utf-8");

        // Assuming your modules have names like 'my-module', 'utils', etc.
        const moduleName = file.replace(".js.map", ""); // Adjust if needed
        moduleMap[moduleName] = await findModuleFromSourceMap(
            moduleName,
            sourceMapContent
        );
    }
    // store the module map in process.env.MODULE_MAP;
    process.env.MODULE_MAP = JSON.stringify(moduleMap);
}

generateRuntimeModuleMap("./dist/sourcemaps", "./dist/runtime-module-map.json");
