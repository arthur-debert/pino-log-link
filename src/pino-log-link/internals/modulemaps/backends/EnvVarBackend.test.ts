import { SourceMapBackendReadError, SourceMapBackendStoreError } from '../errors/errors';
import EnvVarBackend from './EnvVarBackend';
import getMapFromEnv from './getMapFromEnv';
import storeMapInEnv from './storeMapInEnv';

jest.mock('./getMapFromEnv');
jest.mock('./storeMapInEnv');

describe('EnvVarBackend', () => {
    beforeEach(() => {
        (getMapFromEnv as jest.Mock).mockReset();
        (storeMapInEnv as jest.Mock).mockReset();
    });

    it('should store the module map in the environment variable with default name', async () => {
        const moduleMap = { 'moduleA': '/path/to/moduleA' };
        const backend = new EnvVarBackend();
        await backend.store(moduleMap);
        expect(storeMapInEnv).toHaveBeenCalledWith(moduleMap, 'MODULE_MAP');
    });

    it('should store the module map in the environment variable with custom name', async () => {
        const moduleMap = { 'moduleA': '/path/to/moduleA' };
        const backend = new EnvVarBackend();
        const options = { envVarName: 'CUSTOM_MODULE_MAP' };
        await backend.store(moduleMap, options);
        expect(storeMapInEnv).toHaveBeenCalledWith(moduleMap, 'CUSTOM_MODULE_MAP');
    });

    it('should throw a SourceMapBackendStoreError if storeMapInEnv throws an error', async () => {
        const moduleMap = { 'moduleA': '/path/to/moduleA' };
        const backend = new EnvVarBackend();
        (storeMapInEnv as jest.Mock).mockImplementation(() => {
            throw new Error('Some error occurred');
        });
        await expect(backend.store(moduleMap)).rejects.toThrowError(new SourceMapBackendStoreError('Error storing source map in environment variable'));
    });

    it('should read the module map from the environment variable with default name', async () => {
        const moduleMap = { 'moduleA': '/path/to/moduleA' };
        (getMapFromEnv as jest.Mock).mockReturnValue(moduleMap);
        const backend = new EnvVarBackend();
        const result = await backend.read();
        expect(getMapFromEnv).toHaveBeenCalledWith('MODULE_MAP');
        expect(result).toEqual(moduleMap);
    });

    it('should read the module map from the environment variable with custom name', async () => {
        const moduleMap = { 'moduleA': '/path/to/moduleA' };
        (getMapFromEnv as jest.Mock).mockReturnValue(moduleMap);
        const backend = new EnvVarBackend();
        const options = { envVarName: 'CUSTOM_MODULE_MAP' };
        const result = await backend.read(options);
        expect(getMapFromEnv).toHaveBeenCalledWith('CUSTOM_MODULE_MAP');
        expect(result).toEqual(moduleMap);
    });

    it('should throw a SourceMapBackendReadError if getMapFromEnv throws an error', async () => {
        const backend = new EnvVarBackend();
        (getMapFromEnv as jest.Mock).mockImplementation(() => {
            throw new Error('Some error occurred');
        });
        await expect(backend.read()).rejects.toThrowError(new SourceMapBackendReadError('Error reading source map from environment variable'));
    });
});
