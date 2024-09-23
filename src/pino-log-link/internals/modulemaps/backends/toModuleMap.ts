import { InvalidModuleMapError, InvalidModuleMapSerializationError } from "../errors";
import ModuleMap from "../types";

/**
 * Converts an object or a string to a ModuleMap and validates the format.
 *
 * @param obj - The object to convert to a ModuleMap or a string.
 * @thorws InvalidModuleMapError if the object is not a valid ModuleMap.
 * @returns The ModuleMap object.
 */
export default function toModuleMap(obj: object | string): ModuleMap {
    // if obj is a string, try to parse it as JSON
    if (typeof obj === 'string') {
        let raw: string = obj

        try {
            obj = JSON.parse(obj);
        } catch (error) {
            const truncatedText = raw.substring(0, 200);
            throw new InvalidModuleMapSerializationError(
                `Failed to parse JSON: ${truncatedText}...`,
                raw
            );
        }
    }
    if (typeof obj !== 'object' || obj === null) {
        throw new InvalidModuleMapError('Invalid data format: Expected an object.');
    }
    if (!Object.values(obj).every(value => typeof value === 'string')) {
        throw new InvalidModuleMapError('Invalid ModuleMap format: Values must be strings.');
    }
    return obj as ModuleMap;
}
