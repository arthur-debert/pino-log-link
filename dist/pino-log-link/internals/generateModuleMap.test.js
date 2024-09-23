import { Volume } from 'memfs';
import generateModuleMap from './generateModuleMap';
let vol;
describe('generateModuleMap', () => {
    beforeEach(() => {
        vol = Volume.fromJSON({});
        jest.doMock('fs', () => vol);
    });
    afterEach(() => {
        jest.resetModules();
    });
    it('should generate a module map for a simple directory structure', () => {
        vol = Volume.fromJSON({
            '/project/src/moduleA.ts': '// moduleA.ts content',
            '/project/src/moduleB.js': '// moduleB.js content',
        });
        const moduleMap = generateModuleMap('/project/src', ['.ts', '.js'], vol);
        expect(moduleMap).toEqual({
            'moduleA': '/project/src/moduleA.ts',
            'moduleB': '/project/src/moduleB.js',
        });
    });
    it('should handle modules with the same name in different directories', () => {
        vol = Volume.fromJSON({
            '/project/src/featureA/moduleX.ts': '// featureA/moduleX.ts content',
            '/project/src/featureB/moduleX.ts': '// featureB/moduleX.ts content',
            '/project/src/moduleY.js': '// moduleY.js content',
        });
        const moduleMap = generateModuleMap('/project/src', ['.ts', '.js'], vol);
        expect(moduleMap).toEqual({
            'featureA/moduleX': '/project/src/featureA/moduleX.ts',
            'featureB/moduleX': '/project/src/featureB/moduleX.ts',
            'moduleY': '/project/src/moduleY.js',
        });
    });
    it('should handle deeply nested modules with the same name', () => {
        vol = Volume.fromJSON({
            '/project/src/featureA/component/moduleZ.ts': '// featureA/component/moduleZ.ts content',
            '/project/src/featureB/utils/moduleZ.ts': '// featureB/utils/moduleZ.ts content',
        });
        const moduleMap = generateModuleMap('/project/src', ['.ts', '.js'], vol);
        expect(moduleMap).toEqual({
            'featureA/component/moduleZ': '/project/src/featureA/component/moduleZ.ts',
            'featureB/utils/moduleZ': '/project/src/featureB/utils/moduleZ.ts',
        });
    });
});
