import ModuleMap from "../types";

export default function storeMapInEnv(map: ModuleMap, envVarName: string = 'MODULE_MAP'): void {
    process.env[envVarName] = JSON.stringify(map);
}