import fromModuleToFileURL from './fromModuleToFileURL';

describe('fromModuleToFileURL', () => {
    it('should return the correct file URL for a known module', () => {
        const moduleMap = {
            'moduleA': '/project/src/moduleA.ts',
            'moduleB': '/project/src/moduleB.js',
        };
        const baseUrl = 'http://localhost:3000/';
        expect(fromModuleToFileURL('moduleA', moduleMap, baseUrl)).toBe('http://localhost:3000/project/src/moduleA.ts');
    });

    it('should return "not found!" for an unknown module', () => {
        const moduleMap = {
            'moduleA': '/project/src/moduleA.ts',
            'moduleB': '/project/src/moduleB.js',
        };
        const baseUrl = 'http://localhost:3000/';
        expect(fromModuleToFileURL('moduleC', moduleMap, baseUrl)).toBe('not found!');
    });
});
