import NoopMap from "./NoopMap";

type ModuleMap = Record<string, string> | NoopMap;
export default ModuleMap;


export interface EnvVarOptions {
    type: 'envVar';
    envVarName: string;
}
export interface HTTPOptions {
    identifier: any;
    type: 'http';
    url: string;
}
export interface NoopOptions {
    type: 'noop';
}
export interface UnOption { }

export type StorageOptions = EnvVarOptions | HTTPOptions | NoopOptions | UnOption;

