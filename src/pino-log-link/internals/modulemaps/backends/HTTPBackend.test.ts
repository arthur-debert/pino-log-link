import ModuleMap from "./../types";
import { HTTPOptions, StorageOptions } from "../types";
import HTTPBackend, { validateHTTPOptions } from "./HTTPBackend";

// mock fetch
global.fetch = jest.fn();

describe('HTTPBackend', () => {
    let backend: HTTPBackend;

    beforeEach(() => {
        backend = new HTTPBackend({ type: 'http' });
    });

    describe('validateHTTPOptions', () => {
        it('should throw an error if options is undefined', () => {
            expect(() => {
                validateHTTPOptions(undefined);
            }).toThrow('Options must be provided for HTTPBackend.');
        });

        it('should throw an error if options type is not "http"', () => {
            const options: StorageOptions = {
                type: 'envVar',
                envVarName: 'MODULE_MAP',
            };
            expect(() => {
                validateHTTPOptions(options as HTTPOptions);
            }).toThrow()
        });

        it('should throw an error if identifier or url is missing', () => {
            const options1: StorageOptions = {
                type: 'http',
                url: 'https://example.com',
            } as StorageOptions;

            const options2: StorageOptions = {
                type: 'http',
                identifier: 'myModuleMap',
            } as StorageOptions;

            expect(() => {
                validateHTTPOptions(options1 as HTTPOptions);
            }).toThrow('Identifier and URL must be provided for HTTPBackend.');

            expect(() => {
                validateHTTPOptions(options2 as HTTPOptions);
            }).toThrow('Identifier and URL must be provided for HTTPBackend.');
        });

        it('should return identifier and url for valid options', () => {
            const options: StorageOptions = {
                type: 'http',
                identifier: 'myModuleMap',
                url: 'https://example.com',
            };
            const { identifier, url } = validateHTTPOptions(options as HTTPOptions);
            expect(identifier).toBe('myModuleMap');
            expect(url).toBe('https://example.com');
        });
    });

    describe('store', () => {
        it('should store the url with the given identifier', async () => {
            const map = {
                'moduleA': '/path/to/moduleA',
                'moduleB': '/path/to/moduleB',
            };
            const options: HTTPOptions = {
                type: 'http',
                identifier: 'myModuleMap',
                url: 'https://example.com',
            };
            await backend.store(map, options);
            expect(backend['urls']['myModuleMap']).toBe('https://example.com');
        });
    });

    describe('read', () => {
        it('should call getMapFromHTTPRequest with the correct url', async () => {
            const options: HTTPOptions = {
                type: 'http',
                identifier: 'myModuleMap',
                url: 'https://example.com',
            };
            backend['urls']['myModuleMap'] = 'https://example.com';
            const getMapFromHTTPRequestSpy = jest
                .spyOn(require('./getMapFromHTTPRequest'), 'default')
                .mockResolvedValue({});
            await backend.fetch(options);
            expect(getMapFromHTTPRequestSpy).toHaveBeenCalledWith('https://example.com');
        });
    });
});

