import storeMapInEnv from './storeMapInEnv';

describe('storeMapInEnv', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules(); // this is important - it clears the cache
        process.env = { ...OLD_ENV }; // make a copy
    });

    afterAll(() => {
        process.env = OLD_ENV; // restore old env
    });

    it('should store the module map in the environment variable', () => {
        const moduleMap = {
            'moduleA': '/path/to/moduleA',
            'moduleB': '/path/to/moduleB',
        };
        storeMapInEnv(moduleMap);
        expect(process.env.MODULE_MAP).toBe(JSON.stringify(moduleMap));
    });

    it('should use the provided environment variable name', () => {
        const moduleMap = { 'moduleC': '/path/to/moduleC' };
        storeMapInEnv(moduleMap, 'CUSTOM_MODULE_MAP');
        expect(process.env.CUSTOM_MODULE_MAP).toBe(JSON.stringify(moduleMap));
    });
});
