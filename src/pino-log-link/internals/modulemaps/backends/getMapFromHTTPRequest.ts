import { InvalidModuleMapSerializationError } from "../errors";
import ModuleMap from "../types";
import fetchHttp from "./fetchHttp";
import toModuleMap from "./toModuleMap";

/**
 * Simple wrapper that ensures common error handling for HTTP requests and
 * conversion to ModuleMap.
 */
export default async function getMapFromHTTPRequest(url: string): Promise<ModuleMap> {
    const text = await fetchHttp(url);
    // since toModuleMap() validates the format, we can safely return the result
    return Promise.resolve(toModuleMap(text)); // Validation might be redundant
}
