import generateMapFromSourceMaps, { processSourceMap } from './generateMapFromSourceMaps';
import ModuleMap from '../types';
import { Volume } from 'memfs';

describe('processSourceMap', () => {
    it('should return an empty object for an empty string', () => {
        const content = '';
        const result = processSourceMap(content);
        expect(result).toEqual({});
    });

    it('should correctly parse a single line source map', () => {
        const content = '/project/src/moduleA.ts moduleA';
        const result = processSourceMap(content);
        const expected: ModuleMap = {
            'moduleA': '/project/src/moduleA.ts',
        };
        expect(result).toEqual(expected);
    });

    it('should correctly parse a multi-line source map', () => {
        const content = '/project/src/moduleA.ts moduleA\n/project/src/moduleB.ts moduleB';
        const result = processSourceMap(content);
        const expected: ModuleMap = {
            'moduleA': '/project/src/moduleA.ts',
            'moduleB': '/project/src/moduleB.ts',
        };
        expect(result).toEqual(expected);
    });

    it('should handle empty lines gracefully', () => {
        const content = '/project/src/moduleA.ts moduleA\n\n/project/src/moduleB.ts moduleB';
        const result = processSourceMap(content);
        const expected: ModuleMap = {
            'moduleA': '/project/src/moduleA.ts',
            'moduleB': '/project/src/moduleB.ts',
        };
        expect(result).toEqual(expected);
    });

    it('should handle lines with only spaces gracefully', () => {
        const content = '/project/src/moduleA.ts moduleA\n   \n/project/src/moduleB.ts moduleB';
        const result = processSourceMap(content);
        const expected: ModuleMap = {
            'moduleA': '/project/src/moduleA.ts',
            'moduleB': '/project/src/moduleB.ts',
        };
        expect(result).toEqual(expected);
    });
});

describe('generateMapFromSourceMaps', () => {
    it('should throw an error if the source map path does not exist', async () => {
        const fsProvider = {
            existsSync: jest.fn().mockReturnValue(false),
        };
        await expect(generateMapFromSourceMaps('/path/to/non/existing/dir', fsProvider)).rejects.toThrowError('Source map path does not exist: /path/to/non/existing/dir');
    });

    it('should correctly read a single source map file', async () => {
        const vol = Volume.fromJSON({
            '/path/to/sourcemaps/sourceMap.txt': 'some/path/moduleA.ts moduleA',
        });
        const fsProvider = vol;
        const expected: ModuleMap = {
            'moduleA': 'some/path/moduleA.ts',
        };
        const result = await generateMapFromSourceMaps('/path/to/sourcemaps/sourceMap.txt', fsProvider);
        expect(result).toEqual(expected);
    });

    it('should correctly read and merge multiple source map files in a directory', async () => {
        const vol = Volume.fromJSON({
            '/path/to/sourcemaps/sourceMap1.txt': 'some/path/moduleA.ts moduleA',
            '/path/to/sourcemaps/sourceMap2.txt': 'some/path/moduleB.ts moduleB',
        });
        const fsProvider = vol;
        const expected: ModuleMap = {
            'moduleA': 'some/path/moduleA.ts',
            'moduleB': 'some/path/moduleB.ts',
        };
        const result = await generateMapFromSourceMaps('/path/to/sourcemaps', fsProvider);
        expect(result).toEqual(expected);
    });

    it('should ignore non-files in a directory', async () => {
        const vol = Volume.fromJSON({
            '/path/to/sourcemaps/sourceMap1.txt': 'some/path/moduleA.ts moduleA',
            '/path/to/sourcemaps/some-directory': null,
        });
        const fsProvider = vol;
        const expected: ModuleMap = {
            'moduleA': 'some/path/moduleA.ts',
        };
        const result = await generateMapFromSourceMaps('/path/to/sourcemaps', fsProvider);
        expect(result).toEqual(expected);
    });
});
