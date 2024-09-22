import findModulePath from "./findModulePath";
/**
 * Will find the moduleName in the moduleMap, and return the correspoding file path
 * as a file URL. If the module is not found, it will return 'not found!'.
 * You can assume that the paths first level map te urls first level , that is
 * a path like '/project/src/moduleA.ts' will be mapped [url base]/project/src/moduleA.ts
 * The mapped url will be used inside the devtools to open the file in the editor.
 */
function fromModuleToFileURL(moduleName: string, moduleMap: Record<string, string>, baseUrl: string): string {
    const modulePath = findModulePath(moduleName, moduleMap);
    if (modulePath === 'not found!') {
        return modulePath;
    }
    const fileURL = new URL(modulePath, baseUrl);
    return fileURL.toString();
}

export default fromModuleToFileURL;
