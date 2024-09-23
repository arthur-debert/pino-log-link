import { SourceMapManager, FileSystemGenerator, EnvVarBackend, SourceMapMapGenerator, StorageOptions } from './SourceMapManager';
import { SourceMapGenError, SourceMapBackendReadError, SourceMapBackendStoreError } from './errors';
import ModuleMap, { EnvVarOptions } from './types';

jest.mock('./generators/FileSystemMapGenerator');
jest.mock('./generators/AbstractSourceMapGenerator');
jest.mock('./backends/EnvVarBackend');

// Mock the dependencies
jest.mock('./generators/FileSystemMapGenerator');
jest.mock('./backends/EnvVarBackend');

const options: EnvVarOptions = { type: 'envVar', envVarName: 'TEST_MODULE_MAP' };
describe('SourceMapManager', () => {
    let manager: SourceMapManager;

    beforeEach(() => {
        // Reset the mocks before each test
        (FileSystemGenerator as jest.Mock).mockClear();
        (EnvVarBackend as jest.Mock).mockClear();
        (SourceMapMapGenerator as jest.Mock).mockClear();

        // Create a new instance of SourceMapManager before each test
    });

    it('should be created with the correct generator and store', () => {
        expect(manager).toBeDefined();
        expect(manager['generator']).toBeInstanceOf(FileSystemGenerator);
        expect(manager['store']).toBeInstanceOf(EnvVarBackend);
    });

    describe('generateAndStoreSourceMap', () => {
        it('should call the generator and store with the correct arguments', async () => {
            const options: EnvVarOptions = { type: 'envVar', envVarName: 'TEST_MODULE_MAP' };
            manager = new SourceMapManager(new FileSystemGenerator('/some/path'), new EnvVarBackend(options));
            const mockMap = { moduleA: '/path/to/moduleA' };

            (manager['generator'].generate as jest.Mock).mockResolvedValue(mockMap);
            (manager['store'].store as jest.Mock).mockResolvedValue(undefined);

            const result = await manager.generateMap();

            expect(result).toBe(true);
            expect(manager['generator'].generate).toHaveBeenCalledWith();
        });


        it('should throw an error if generator throws an error', async () => {
            const options: EnvVarOptions = { type: 'envVar', envVarName: 'TEST_MODULE_MAP' };
            manager = new SourceMapManager(new FileSystemGenerator('/some/path'), new EnvVarBackend(options));
            const errorMessage = 'Some generator error';
            (manager['generator'].generate as jest.Mock).mockRejectedValue(new SourceMapGenError(errorMessage));

            await expect(manager.generateMap()).rejects.toThrowError(errorMessage);
            expect(manager['store'].store).not.toHaveBeenCalled();
        });

        it.skip('should throw an error if store throws an error', async () => {
            const options: EnvVarOptions = { type: 'envVar', envVarName: 'TEST_MODULE_MAP' };
            manager = new SourceMapManager(new FileSystemGenerator('/some/path'), new EnvVarBackend(options));
            const mockMap = { moduleA: '/path/to/moduleA' };
            const errorMessage = 'Some store error';
            (manager['generator'].generate as jest.Mock).mockResolvedValue(mockMap);
            (manager['store'].store as jest.Mock).mockRejectedValue(new SourceMapBackendStoreError(errorMessage));

            await expect(manager.generateMap()).rejects.toThrow(errorMessage);
            await expect(manager['generator'].generate).toHaveBeenCalledWith();
        });
    });

    describe('getStoredSourceMap', () => {
        it('should call the store with the correct arguments', async () => {
            const options: EnvVarOptions = { type: 'envVar', envVarName: 'TEST_MODULE_MAP' };
            manager = new SourceMapManager(new FileSystemGenerator('/some/path'), new EnvVarBackend(options));
            const mockMap = { moduleA: '/path/to/moduleA' };
            (manager['store'].fetch as jest.Mock).mockResolvedValue(mockMap);

            const result = await manager.fetchMap();

            expect(result).toEqual(mockMap);
            expect(manager['store'].fetch).toHaveBeenCalledWith();
        });

        it('should throw an error if store throws an error', async () => {
            const options: EnvVarOptions = { type: 'envVar', envVarName: 'TEST_MODULE_MAP' };
            manager = new SourceMapManager(new FileSystemGenerator('/some/path'), new EnvVarBackend(options));
            const errorMessage = 'Some store error';
            (manager['store'].fetch as jest.Mock).mockRejectedValue(new SourceMapBackendReadError(errorMessage));

            await expect(manager.fetchMap()).rejects.toThrowError(errorMessage);
        });
    });

    describe('resolve', () => {
        manager = new SourceMapManager(new FileSystemGenerator('/some/path'), new EnvVarBackend(options));
        it('should throw an error if the source map is not found', () => {
            expect(() => {
                manager.resolve('moduleA');
            }).toThrowError('Source map not found!');
        });

        it('should return the correct file path for a given module', () => {
            manager = new SourceMapManager(new FileSystemGenerator('/some/path'), new EnvVarBackend(options));
            manager.map = {
                moduleA: '/path/to/moduleA',
                moduleB: '/path/to/moduleB',
            } as ModuleMap;
            manager.status = 'ready';

            expect(manager.resolve('moduleA')).toBe('/path/to/moduleA');
            expect(manager.resolve('moduleB')).toBe('/path/to/moduleB');
        });

        it('should return "not found!" if the module is not in the map', () => {
            manager = new SourceMapManager(new FileSystemGenerator('/some/path'), new EnvVarBackend(options));
            manager.map = {
                moduleA: '/path/to/moduleA',
            } as ModuleMap;
            manager.status = 'ready';

            expect(manager.resolve('moduleC')).toBe('not found!');
        });
    });
});

// describe('noop implementation', () => {

//     it('should return the key as the value for any key accessed', async () => {
//         const manager = new SourceMapManager(new NoopGenerator(), new NoopBackend())
//         await manager.init();
//         expect(manager.resolve("foo")).toBe("foo");
//         expect(manager.resolve("bar")).toBe("bar");
//         expect(manager.resolve("baz")).toBe("baz");
//     });
// })
