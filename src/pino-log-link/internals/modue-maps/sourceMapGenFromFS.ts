import * as path from 'path';

const DEFAULT_INCLUDE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.mts', '.cts'];

/**
 * Given a root directory, generate a map of all the modules in the directory.
 * This runs on the server side and is used to generate the module map for the
 * client side. We can use regular node modules here if neeed.
 * We want to support the following file extensions: .js, .jsx, .ts, .tsx, .mjs, .cjs, mts, cts.
 * If more than one file has the same module name (say packageA.index.ts and packageB.indexTs),
 * find the smallest path that removes ambguitity, and store that path part as the key to the map
 */
function sourceMapGenFromFS(rootDirectory: string, includeExtensions: string[] = DEFAULT_INCLUDE_EXTENSIONS, fs?: any): Record<string, string> {
    const moduleMap: Record<string, string> = {};
    const moduleNameToFilePath: Record<string, string[]> = {};

    function traverseDirectory(directory: string) {
        if (!fs) {
            fs = require('fs');
        }
        const files = fs.readdirSync(directory);

        for (const file of files) {
            const filePath = path.join(directory, file);
            const fileStat = fs.statSync(filePath);

            if (fileStat.isDirectory()) {
                traverseDirectory(filePath);
            } else if (fileStat.isFile() && includeExtensions.includes(path.extname(file))) {
                const moduleName = path.relative(rootDirectory, filePath).replace(/\//g, '/').replace(/\.[^/.]+$/, '');
                moduleNameToFilePath[moduleName] = moduleNameToFilePath[moduleName] || [];
                moduleNameToFilePath[moduleName].push(filePath);
            }
        }
    }

    traverseDirectory(rootDirectory);

    for (const [moduleName, filePaths] of Object.entries(moduleNameToFilePath)) {
        if (filePaths.length === 1) {
            moduleMap[moduleName] = filePaths[0];
        } else {
            const commonPrefix = findLongestCommonPrefix(filePaths);
            // Prioritize .ts files when resolving conflicts
            let moduleKey = '';
            for (const filePath of filePaths) {
                if (filePath.endsWith('.ts')) {
                    moduleKey = filePath.substring(commonPrefix.length).replace(/\//g, '/').replace(/\.[^/.]+$/, '');
                    break; // Prioritize the first .ts file found
                }
            }
            // If no .ts file is found, use the original logic
            if (moduleKey === '') {
                moduleKey = filePaths[0].substring(commonPrefix.length).replace(/\//g, '/').replace(/\.[^/.]+$/, '');
            }
            moduleMap[moduleKey] = filePaths[0];
        }
    }


    return moduleMap;
}

function findLongestCommonPrefix(strs: string[]): string {
    if (strs.length === 0) {
        return "";
    }
    let prefix = strs[0];
    for (let i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(prefix) !== 0) {
            prefix = prefix.substring(0, prefix.length - 1);
            if (prefix === "") {
                return "";
            }
        }
    }
    return prefix;
}

export default sourceMapGenFromFS;

