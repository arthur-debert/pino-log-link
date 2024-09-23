function findModuleFromEnv(moduleName: string, envVarName: string = 'MODULE_MAP'): string {
    const MODULE_MAP = process.env[envVarName] ? JSON.parse(process.env[envVarName] as string) : {};
    return MODULE_MAP[moduleName] || 'not found!';
}

export default findModuleFromEnv;
