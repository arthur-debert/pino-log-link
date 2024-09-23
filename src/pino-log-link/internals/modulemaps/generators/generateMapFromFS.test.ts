import { Volume } from 'memfs';
import sourceMapGenFromFS, { getModuleKey } from './generateMapFromFS';
import generateMapFromFS, { findLongestCommonPrefix } from './generateMapFromFS';

let vol: any;

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

        const moduleMap = sourceMapGenFromFS('/project/src', ['.ts', '.js'], vol);

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

        const moduleMap = sourceMapGenFromFS('/project/src', ['.ts', '.js'], vol);

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

        const moduleMap = sourceMapGenFromFS('/project/src', ['.ts', '.js'], vol);

        expect(moduleMap).toEqual({
            'featureA/component/moduleZ': '/project/src/featureA/component/moduleZ.ts',
            'featureB/utils/moduleZ': '/project/src/featureB/utils/moduleZ.ts',
        });
    });
});
describe('generateModuleMap', () => {
    let vol: any;

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

        const moduleMap = sourceMapGenFromFS('/project/src', ['.ts', '.js'], vol);

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

        const moduleMap = sourceMapGenFromFS('/project/src', ['.ts', '.js'], vol);

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

        const moduleMap = sourceMapGenFromFS('/project/src', ['.ts', '.js'], vol);

        expect(moduleMap).toEqual({
            'featureA/component/moduleZ': '/project/src/featureA/component/moduleZ.ts',
            'featureB/utils/moduleZ': '/project/src/featureB/utils/moduleZ.ts',
        });
    });

    it('should handle cases with no common prefix', () => {
        vol = Volume.fromJSON({
            '/project/src/moduleA.ts': '// moduleA.ts content',
            '/project/src2/moduleA.ts': '// moduleA.ts content',
        });

        const moduleMap = sourceMapGenFromFS('/project/src', ['.ts', '.js'], vol);

        expect(moduleMap).toEqual({
            'moduleA': '/project/src/moduleA.ts',

        });
    });

    it('should handle cases with a common prefix that is the entire path', () => {
        vol = Volume.fromJSON({
            '/project/src/moduleA.ts': '// moduleA.ts content',
            '/project/src/moduleA.js': '// moduleA.js content',
        });

        const moduleMap = sourceMapGenFromFS('/project/src', ['.ts', '.js'], vol);

        expect(moduleMap).toEqual({
            "ts": "/project/src/moduleA.js",
        });
    });
});
describe('generateModuleMap', () => {
    beforeEach(() => {
        vol = Volume.fromJSON({});
        jest.doMock('fs', () => vol);
    });

    afterEach(() => {
        jest.resetModules();
    });

    it('should handle cases with no common prefix', () => {
        vol = Volume.fromJSON({
            '/project/src/moduleA.ts': '// moduleA.ts content',
            '/project/src2/moduleA.ts': '// moduleA.ts content',
        });

        const moduleMap = generateMapFromFS('/project/src', ['.ts', '.js'], vol);

        expect(moduleMap).toEqual({
            'moduleA': '/project/src/moduleA.ts',

        });
    });
});


describe('generateModuleMap', () => {
    beforeEach(() => {
        vol = Volume.fromJSON({});
        jest.doMock('fs', () => vol);
    });

    afterEach(() => {
        jest.resetModules();
    });

    it('should handle cases with no common prefix', () => {
        vol = Volume.fromJSON({
            '/project/src/moduleA.ts': '// moduleA.ts content',
            '/project/src2/moduleA.ts': '// moduleA.ts content',
        });

        const moduleMap = generateMapFromFS('/project/src', ['.ts', '.js'], vol);

        expect(moduleMap).toEqual({
            'moduleA': '/project/src/moduleA.ts',

        });
    });

    it('should handle cases with a common prefix that is the entire path', () => {
        vol = Volume.fromJSON({
            '/project/src/moduleA.ts': '// moduleA.ts content',
            '/project/src/moduleA.js': '// moduleA.js content',
        });

        const moduleMap = generateMapFromFS('/project/src', ['.ts', '.js'], vol);

        expect(moduleMap).toEqual({
            "ts": "/project/src/moduleA.js",
        });
    });
});

describe('findLongestCommonPrefix', () => {
    it('should return an empty string for an empty array', () => {
        expect(findLongestCommonPrefix([])).toBe('');
    });

    it('should return the first string if there is only one string', () => {
        expect(findLongestCommonPrefix(['abc'])).toBe('abc');
    });

    it('should return the longest common prefix for multiple strings', () => {
        expect(findLongestCommonPrefix(['flower', 'flow', 'flight'])).toBe('fl');
    });

    it('should return an empty string if there is no common prefix', () => {
        expect(findLongestCommonPrefix(['dog', 'racecar', 'car'])).toBe('');
    });

    it('should handle cases where one string is a prefix of another', () => {
        expect(findLongestCommonPrefix(['car', 'cart'])).toBe('car');
    });
});

describe('getModuleKey', () => {
    it('should prioritize .ts files and return the correct module key', () => {
        const filePaths = [
            '/project/src/feature/module.js',
            '/project/src/feature/module.ts',
        ];
        const commonPrefix = '/project/src/';
        const moduleKey = '';
        expect(getModuleKey(filePaths, moduleKey, commonPrefix)).toBe('feature/module');
    });

    it('should handle cases where no .ts file is found and return the correct module key', () => {
        const filePaths = [
            '/project/src/feature/module.js',
            '/project/src/feature/module.jsx',
        ];
        const commonPrefix = '/project/src/';
        const moduleKey = '';
        expect(getModuleKey(filePaths, moduleKey, commonPrefix)).toBe('feature/module');
    });

    it('should handle cases with deeply nested paths', () => {
        const filePaths = [
            '/project/src/deeply/nested/feature/module.js',
            '/project/src/deeply/nested/feature/module.ts',
        ];
        const commonPrefix = '/project/src/';
        const moduleKey = '';
        expect(getModuleKey(filePaths, moduleKey, commonPrefix)).toBe('deeply/nested/feature/module');
    });

    it('should handle cases where common prefix is the entire path', () => {
        const filePaths = [
            '/project/src/module.js',
            '/project/src/module.ts',
        ];
        const commonPrefix = '/project/src/';
        const moduleKey = '';
        expect(getModuleKey(filePaths, moduleKey, commonPrefix)).toBe('module');
    });
});
