import path from 'path';
import fs from 'fs';
/**
 * Loops through the src code root (projectRoot/src and generates a map where
 * the key is the module name and the value is the path to the module
 *
 * For example:
 * "FrameBuffer"; "bigimg/renderer/FrameBuffer.ts"
 */
function genMap(srcDir: string, prefix: string): Record<string, string> {
    const map: Record<string, string> = {};

    function processDirectory(dir: string): void {
        fs.readdirSync(dir).forEach((file) => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                processDirectory(filePath);
            } else if (
                (path.extname(file) === ".ts" ||
                    path.extname(file) === ".js") &&
                !file.endsWith(".d.ts")
            ) {
                const modulePath = path
                    .relative(srcDir, filePath)
                    .replace(/\.(ts|js)$/, ""); // Remove either .ts or .js
                const moduleName = path.basename(modulePath);
                const modulePackage = path.basename(path.dirname(modulePath));
                const key = modulePackage === moduleName ? moduleName : `${modulePackage}/${moduleName}`;
                map[key] = `${prefix}${modulePath}.${path
                    .extname(file)
                    .slice(1)}`; // Add back the correct extension
            }
        });
    }

    processDirectory(srcDir);
    return map;
}

export default genMap;
