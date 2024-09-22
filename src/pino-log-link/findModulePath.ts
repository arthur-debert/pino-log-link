function findModulePath(moduleName: string, pathMap: Record<string, string>): string {
    const unkown = 'not found!'
    return pathMap[moduleName] || unkown;
}
export default findModulePath;