/**
 * Loops through the src code root (projectRoot/src and generates a map where
 * the key is the module name and the value is the path to the module
 *
 * For example:
 * "FrameBuffer"; "bigimg/renderer/FrameBuffer.ts"
 */
function genMap(fs, path, srcDir, prefix) {
    let map = {};

    function processDirectory(dir) {
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
                map[moduleName] = `${prefix}${modulePath}.${path
                    .extname(file)
                    .slice(1)}`; // Add back the correct extension
            }
        });
    }

    processDirectory(srcDir);
    return map;
}
module.exports = genMap;
