function findModulePath(moduleName, pathMap) {
    const unkown = 'not found!';
    return pathMap[moduleName] || unkown;
}
export default findModulePath;
