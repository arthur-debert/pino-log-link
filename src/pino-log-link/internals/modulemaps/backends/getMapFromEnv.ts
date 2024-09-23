import ModuleMap from "../types";

function getMapFromEnv(envVarName: string = 'MODULE_MAP'): ModuleMap {
    const MODULE_MAP = process.env[envVarName] ? JSON.parse(process.env[envVarName] as string) : {};
    return MODULE_MAP
}

export default getMapFromEnv;
