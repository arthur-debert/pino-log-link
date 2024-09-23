import ModuleMap from "./types";

function sourceMapResolve(moduleName: string, pathMap: ModuleMap): string {
    const unkown = 'not found!'
    return pathMap[moduleName] || unkown;
}
export default sourceMapResolve;