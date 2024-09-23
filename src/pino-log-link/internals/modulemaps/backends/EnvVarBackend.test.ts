import { SourceMapBackendReadError, SourceMapBackendStoreError } from '../errors';
import { EnvVarOptions } from '../types';
import EnvVarBackend from './EnvVarBackend';
import getMapFromEnv from './getMapFromEnv';
import storeMapInEnv from './storeMapInEnv';

jest.mock('./getMapFromEnv');
jest.mock('./storeMapInEnv');

describe('EnvVarBackend', () => {
    const defaultOptions: EnvVarOptions = { envVarName: 'MODULE_MAP', type: 'envVar' };

    beforeEach(() => {
        (getMapFromEnv as jest.Mock).mockReset();
        (storeMapInEnv as jest.Mock).mockReset();
    });

    it('should store the module map in the environment variable with default name', async () => {
        const moduleMap = { 'moduleA': '/path/to/moduleA' };
        const backend = new EnvVarBackend(defaultOptions);
        await backend.store(moduleMap);
        expect(storeMapInEnv).toHaveBeenCalledWith(moduleMap, 'MODULE_MAP');
    });

    it('should store the module map in the environment variable with custom name', async () => {
        const moduleMap = { 'moduleA': '/path/to/moduleA' };
        const backend = new EnvVarBackend(defaultOptions);
        const options = { envVarName: 'CUSTOM_MODULE_MAP' };
        await backend.store(moduleMap);
        expect(storeMapInEnv).toHaveBeenCalledWith(moduleMap, backend.envVarName);
    });

    it('should throw a SourceMapBackendStoreError if storeMapInEnv throws an error', async () => {
        const moduleMap = { 'moduleA': '/path/to/moduleA' };
        const backend = new EnvVarBackend(defaultOptions);

        // Suppress console.error output during this test
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        (storeMapInEnv as jest.Mock).mockImplementation(() => {
            throw new Error('Some error occurred');
        });

        await expect(backend.store(moduleMap)).rejects.toThrowError(new SourceMapBackendStoreError('Error storing source map in environment variable'));

        // Restore console.error functionality
        consoleErrorSpy.mockRestore();
    });

    it('should read the module map from the environment variable with default name', async () => {
        const moduleMap = { 'moduleA': '/path/to/moduleA' };
        (getMapFromEnv as jest.Mock).mockReturnValue(moduleMap);
        const backend = new EnvVarBackend(defaultOptions);
        const result = await backend.fetch(defaultOptions);
        expect(getMapFromEnv).toHaveBeenCalledWith('MODULE_MAP');
        expect(result).toEqual(moduleMap);
    });

    it('should read the module map from the environment variable with custom name', async () => {
        const moduleMap = { 'moduleA': '/path/to/moduleA' };
        (getMapFromEnv as jest.Mock).mockReturnValue(moduleMap);
        const options: EnvVarOptions = { envVarName: 'CUSTOM_MODULE_MAP', type: "envVar" }
        const backend = new EnvVarBackend(options);
        const result = await backend.fetch();
        expect(getMapFromEnv).toHaveBeenCalledWith('CUSTOM_MODULE_MAP');
        expect(result).toEqual(moduleMap);
    });

    it('should throw a SourceMapBackendReadError if getMapFromEnv throws an error', async () => {
        const backend = new EnvVarBackend({ envVarName: 'MODULE_MAP', type: 'envVar' });

        // Suppress console.error output during this test
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        (getMapFromEnv as jest.Mock).mockImplementation(() => {
            throw new Error('Some error occurred');
        });

        await expect(backend.fetch()).rejects.toThrowError(new SourceMapBackendReadError('Error reading source map from environment variable'));

        // Restore console.error functionality
        consoleErrorSpy.mockRestore();
    });

});
