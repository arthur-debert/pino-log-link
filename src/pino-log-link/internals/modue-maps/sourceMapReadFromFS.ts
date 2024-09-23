async function sourceMapReadFromFS(mapPath: string = "module-map.json"): Promise<Record<string, string>> {
    const response = await fetch(mapPath);
    const moduleMap = await response.json() as Record<string, string>;
    return moduleMap;
}
export default sourceMapReadFromFS;