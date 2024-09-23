import mapPropToUrl from './mapPropToUrl';
describe('mapPropToUrl', () => {
    it('should remove the property from the object and append the transformed value to the specified property (array)', () => {
        const object = { module: 'moduleA', message: ['something happened'] };
        const moduleMap = {
            'moduleA': '/project/src/moduleA.ts',
        };
        const baseUrl = 'http://localhost:3000/';
        const result = mapPropToUrl(object, 'module', baseUrl, moduleMap, 'message');
        expect(result).toEqual({ message: ['something happened', 'http://localhost:3000/project/src/moduleA.ts'] });
    });
    it('should remove the property from the object and append the transformed value to the specified property (string)', () => {
        const object = { module: 'moduleA', message: 'something happened' };
        const moduleMap = {
            'moduleA': '/project/src/moduleA.ts',
        };
        const baseUrl = 'http://localhost:3000/';
        const result = mapPropToUrl(object, 'module', baseUrl, moduleMap, 'message');
        expect(result).toEqual({ message: 'something happened http://localhost:3000/project/src/moduleA.ts' });
    });
    it('should work when the property to append to is initially undefined', () => {
        const object = { module: 'moduleA' };
        const moduleMap = {
            'moduleA': '/project/src/moduleA.ts',
        };
        const baseUrl = 'http://localhost:3000/';
        const result = mapPropToUrl(object, 'module', baseUrl, moduleMap, 'message');
        expect(result).toEqual({ message: 'http://localhost:3000/project/src/moduleA.ts' });
    });
    it('should work when the property to append to is initially null', () => {
        const object = { module: 'moduleA', message: null };
        const moduleMap = {
            'moduleA': '/project/src/moduleA.ts',
        };
        const baseUrl = 'http://localhost:3000/';
        const result = mapPropToUrl(object, 'module', baseUrl, moduleMap, 'message');
        expect(result).toEqual({ message: 'http://localhost:3000/project/src/moduleA.ts' });
    });
    it('should return "not found!" when the module is not found', () => {
        const object = { module: 'moduleB', message: 'something happened' };
        const moduleMap = {
            'moduleA': '/project/src/moduleA.ts',
        };
        const baseUrl = 'http://localhost:3000/';
        const result = mapPropToUrl(object, 'module', baseUrl, moduleMap, 'message');
        expect(result).toEqual({ message: 'something happened not found!' });
    });
});
