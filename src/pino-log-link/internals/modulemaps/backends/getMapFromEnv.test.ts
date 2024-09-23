import getMapFromEnv from './getMapFromEnv';

describe('getMapFromEnv', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules(); // this is important - it clears the cache
        process.env = { ...OLD_ENV }; // make a copy
    });

    afterAll(() => {
        process.env = OLD_ENV; // restore old env
    });

    it('should return an empty object if the environment variable is not set', () => {
        delete process.env.MODULE_MAP;
        expect(getMapFromEnv()).toEqual({});
    });

    it('should return an empty object if the environment variable is set to an empty string', () => {
        process.env.MODULE_MAP = '';
        expect(getMapFromEnv()).toEqual({});
    });

    it('should return the parsed JSON object if the environment variable is set to a valid JSON string', () => {
        const moduleMap = {
            'moduleA': '/path/to/moduleA',
            'moduleB': '/path/to/moduleB',
        };
        process.env.MODULE_MAP = JSON.stringify(moduleMap);
        expect(getMapFromEnv()).toEqual(moduleMap);
    });

    it('should use the provided environment variable name', () => {
        const moduleMap = { 'moduleC': '/path/to/moduleC' };
        process.env.CUSTOM_MODULE_MAP = JSON.stringify(moduleMap);
        expect(getMapFromEnv('CUSTOM_MODULE_MAP')).toEqual(moduleMap);
    });
});
