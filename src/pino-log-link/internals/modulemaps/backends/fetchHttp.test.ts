import { HttpError, NetworkError } from "../errors";
import fetchHttp from "./fetchHttp";

// mock fetch
global.fetch = jest.fn();

describe('fetchHttp', () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    it('should return the text response for a successful request', async () => {
        const mockResponse = {
            ok: true,
            text: jest.fn().mockResolvedValue('Success!'),
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await fetchHttp('https://example.com');

        expect(result).toBe('Success!');
        expect(fetch).toHaveBeenCalledWith('https://example.com');
    });

    it('should throw a NetworkError for a network error', async () => {
        (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        await expect(fetchHttp('https://example.com')).rejects.toThrow(
            'Failed to fetch the URL' // Check message only
        );
    });


    it('should throw an HttpError for a non-ok response', async () => {
        const mockResponse = {
            ok: false,
            status: 404,
            statusText: 'Not Found',
            text: jest.fn().mockResolvedValue('Error details'),
        };
        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        await expect(fetchHttp('https://example.com')).rejects.toThrow(
            new NetworkError('Failed to fetch the URL', 'https://example.com', { cause: new HttpError('Not Found', 404) })
        );
    });
});
