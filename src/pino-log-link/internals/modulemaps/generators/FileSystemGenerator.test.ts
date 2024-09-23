import { SourceMapGenError } from '../errors/errors';
import FileSystemGenerator from './FileSystemMapGenerator';
import generateMapFromFS from './generateMapFromFS';

jest.mock('./generateMapFromFS');

describe('FileSystemGenerator', () => {
    beforeEach(() => {
        (generateMapFromFS as jest.Mock).mockReset();
    });

    it('should call sourceMapGenFromFS with the correct arguments', async () => {
        const rootDir = '/path/to/root/dir';
        (generateMapFromFS as jest.Mock).mockReturnValue({});
        const generator = new FileSystemGenerator();
        await generator.generate(rootDir);
        expect(generateMapFromFS).toHaveBeenCalledWith(rootDir, ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.mts', '.cts']);
    });

    it('should return a Promise that resolves with the result of sourceMapGenFromFS', async () => {
        const rootDir = '/path/to/root/dir';
        const expectedMap = { moduleA: '/path/to/moduleA' };
        (generateMapFromFS as jest.Mock).mockReturnValue(expectedMap);
        const generator = new FileSystemGenerator();
        const map = await generator.generate(rootDir);
        expect(map).toEqual(expectedMap);
    });

    it('should throw a SourceMapGenError if sourceMapGenFromFS throws an error', async () => {
        const rootDir = '/path/to/root/dir';
        const errorMessage = 'Some error occurred';
        (generateMapFromFS as jest.Mock).mockImplementation(() => {
            throw new Error(errorMessage);
        });
        const generator = new FileSystemGenerator();
        await expect(generator.generate(rootDir)).rejects.toThrow(new SourceMapGenError('Error generating source map from file system'));
    });
});
