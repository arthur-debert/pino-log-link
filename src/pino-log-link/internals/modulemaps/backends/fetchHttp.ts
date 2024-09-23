import { HttpError, NetworkError } from "../errors";


export default async function fetchHttp(url: string): Promise<String> {
    let response, text;
    try {
        response = await fetch(url);
        text = await response.text();
        if (!response.ok) {
            throw new HttpError(response.statusText, response.status);
        }
    } catch (error) {
        throw new NetworkError('Failed to fetch the URL', url, { cause: error });
    }
    return text;
}
