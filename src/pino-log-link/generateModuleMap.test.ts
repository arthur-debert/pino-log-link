import generateModuleMap from './generateModuleMap';
import * as fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Volume } = require('memfs');

describe('generateModuleMap', () => {
    it('should generate a module map for a simple directory structure', () => {
        const vol = Volume.fromJSON({
            '/project/src/moduleA.ts': '// moduleA.ts content',
            '/project/src/moduleB.js': '// moduleB.js content',
        }, '/project');

        jest.spyOn(fs, 'readdirSync').mockImplementation((path: fs.PathLike) => vol.readdirSync(path.toString()));
        jest.spyOn(fs, 'statSync').mockImplementation((path: fs.PathLike, options?: fs.StatSyncOptions) => vol.statSync(path.toString(), options));

        const moduleMap = generateModuleMap('/project/src', ['.ts', '.js']);

        expect(moduleMap).toEqual({
            'moduleA': '/project/src/moduleA.ts',
            'moduleB': '/project/src/moduleB.js',
        });
    });

    it('should handle nested directories', () => {
        const vol = Volume.fromJSON({
            '/project/src/moduleA.ts': '// moduleA.ts content',
            '/project/src/nested/moduleB.js': '// moduleB.js content',
            '/project/src/nested/deeply/moduleC.tsx': '// moduleC.tsx content',
        }, '/project');

        jest.spyOn(fs, 'readdirSync').mockImplementation((path: fs.PathLike) => vol.readdirSync(path.toString()));
        jest.spyOn(fs, 'statSync').mockImplementation((path: fs.PathLike, options?: fs.StatSyncOptions) => vol.statSync(path.toString(), options));

        const moduleMap = generateModuleMap('/project/src', ['.ts', '.js', '.tsx']);

        expect(moduleMap).toEqual({
            'moduleA': '/project/src/moduleA.ts',
            'nested/moduleB': '/project/src/nested/moduleB.js',
            'nested/deeply/moduleC': '/project/src/nested/deeply/moduleC.tsx',
        });
    });

    it('should handle multiple files with the same module name', () => {
        const vol = Volume.fromJSON({
            '/project/src/packageA/index.ts': '// packageA/index.ts content',
            '/project/src/packageB/index.ts': '// packageB/index.ts content',
        }, '/project');

        jest.spyOn(fs, 'readdirSync').mockImplementation((path: fs.PathLike) => vol.readdirSync(path.toString()));
        jest.spyOn(fs, 'statSync').mockImplementation((path: fs.PathLike) => vol.statSync(path.toString()));

        const moduleMap = generateModuleMap('/project/src', ['.ts']);

        expect(moduleMap).toEqual({
            'packageA/index': '/project/src/packageA/index.ts',
            'packageB/index': '/project/src/packageB/index.ts',
        });
    });

    it('should only include files with specified extensions', () => {
        const vol = Volume.fromJSON({
            '/project/src/moduleA.ts': '// moduleA.ts content',
            '/project/src/moduleB.js': '// moduleB.js content',
            '/project/src/moduleC.txt': '// moduleC.txt content',
        }, '/project');

        jest.spyOn(fs, 'readdirSync').mockImplementation((path: fs.PathLike) => vol.readdirSync(path.toString()));
        jest.spyOn(fs, 'statSync').mockImplementation((path: fs.PathLike) => vol.statSync(path.toString()));

        const moduleMap = generateModuleMap('/project/src', ['.ts', '.js']);

        expect(moduleMap).toEqual({
            'moduleA': '/project/src/moduleA.ts',
            'moduleB': '/project/src/moduleB.js',
        });
    });
});
