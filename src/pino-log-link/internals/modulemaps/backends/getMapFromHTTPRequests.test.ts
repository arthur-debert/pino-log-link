import fetchHttp from "./fetchHttp";
import getMapFromHTTPRequest from "./getMapFromHTTPRequest";
import toModuleMap from "./toModuleMap";

jest.mock('./fetchHttp');
jest.mock('./toModuleMap');

describe('getMapFromHTTPRequest', () => {

    beforeEach(() => {
        (fetchHttp as jest.Mock).mockClear();
        (toModuleMap as jest.Mock).mockClear();
    });
    it('should fetch the module map from the given URL', async () => {
        const url = 'https://example.com/module-map.json';
        const mockModuleMap = {
            'moduleA': '/path/to/moduleA',
            'moduleB': '/path/to/moduleB',
        };
        (fetchHttp as jest.Mock).mockResolvedValue(JSON.stringify(mockModuleMap));
        (toModuleMap as jest.Mock).mockReturnValue(mockModuleMap);

        const moduleMap = await getMapFromHTTPRequest(url);

        expect(fetchHttp).toHaveBeenCalledWith(url);
        expect(toModuleMap).toHaveBeenCalledWith(JSON.stringify(mockModuleMap));
        expect(moduleMap).toEqual(mockModuleMap);
    });
});
