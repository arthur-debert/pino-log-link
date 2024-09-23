import SourceMapMapGenerator from './SourceMapGenerator';
import { SourceMapGenError } from "../errors";
import fs from 'fs';

import ModuleMap from '../types';
import generateMapFromSourceMaps from './generateMapFromSourceMaps';

jest.mock('./generateMapFromSourceMaps');

describe('SourceMapFileGenerator', () => {
    beforeEach(() => {
        (generateMapFromSourceMaps as jest.Mock).mockReset();
    });

    it('should call generateMapFromSourceMaps with the correct arguments', async () => {
        const mapPath = '/path/to/source/map.txt';
        (generateMapFromSourceMaps as jest.Mock).mockReturnValue({});
        const generator = new SourceMapMapGenerator();
        await generator.generate(mapPath);
        expect(generateMapFromSourceMaps).toHaveBeenCalledWith(mapPath, fs);
    });

    it('should return a Promise that resolves with the result of generateMapFromSourceMaps', async () => {
        const mapPath = '/path/to/source/map.txt';
        const expectedMap: ModuleMap = { moduleA: '/path/to/moduleA' };
        (generateMapFromSourceMaps as jest.Mock).mockResolvedValue(expectedMap);

        // Await the promise here
        const map = await new SourceMapMapGenerator().generate(mapPath);

        expect(map).toEqual(expectedMap);
    });


    it('should throw a SourceMapGenError if generateMapFromSourceMaps throws an error', async () => {
        const mapPath = '/path/to/source/map.txt';
        const errorMessage = 'Some error occurred';
        (generateMapFromSourceMaps as jest.Mock).mockImplementation(() => {
            throw new Error(errorMessage);
        });
        const generator = new SourceMapMapGenerator();
        await expect(generator.generate(mapPath)).rejects.toThrowError(new SourceMapGenError('Error generating source map from file'));
    });
});
