/**
 * Given a root directory, generate a map of all the modules in the directory.
 * This runs on the server side and is used to generate the module map for the
 * client side. We can use regular node modules here if neeed.
 * We want to support the following file extensions: .js, .jsx, .ts, .tsx, .mjs, .cjs, mts, cts.
 * If more than one file has the same module name (say packageA.index.ts and packageB.indexTs),
 * find the smallest path that removes ambguitity, and store that path part as the key to the map
 */
declare function generateModuleMap(rootDirectory: string, includeExtensions?: string[], fs?: any): Record<string, string>;
export default generateModuleMap;
