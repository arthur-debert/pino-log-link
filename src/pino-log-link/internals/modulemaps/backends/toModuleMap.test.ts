import { InvalidModuleMapError, InvalidModuleMapSerializationError } from "../errors";
import toModuleMap from "./toModuleMap";
import ModuleMap from "../types";

describe('toModuleMap', () => {
    it('should throw InvalidModuleMapError for non-object input', () => {
        expect(() => toModuleMap(null as any)).toThrow(InvalidModuleMapError);
        expect(() => toModuleMap(undefined as any)).toThrow(InvalidModuleMapError);
        expect(() => toModuleMap('string')).toThrow(InvalidModuleMapError);
        expect(() => toModuleMap(123 as any)).toThrow(InvalidModuleMapError);
        expect(() => toModuleMap(true as any)).toThrow(InvalidModuleMapError);
    });

    it('should throw InvalidModuleMapError for object with non-string values', () => {
        expect(() => toModuleMap({ a: 123 } as any)).toThrow(InvalidModuleMapError);
        expect(() => toModuleMap({ a: 'string', b: true } as any)).toThrow(InvalidModuleMapError);
    });

    it('should return the input object for valid ModuleMap', () => {
        const validModuleMap: ModuleMap = {
            'moduleA': '/path/to/moduleA',
            'moduleB': '/path/to/moduleB',
        };
        expect(toModuleMap(validModuleMap)).toEqual(validModuleMap);
    });

    it('should return a valid ModuleMap when given a valid JSON string', () => {
        const validModuleMap = {
            'moduleA': '/path/to/moduleA',
            'moduleB': '/path/to/moduleB',
        };
        const validModuleMapString = JSON.stringify(validModuleMap);
        expect(toModuleMap(validModuleMapString)).toEqual(validModuleMap);
    });

    it('should throw InvalidModuleMapSerializationError for invalid JSON string', () => {
        const invalidModuleMapString = 'this is not a valid JSON string';
        expect(() => toModuleMap(invalidModuleMapString)).toThrow(InvalidModuleMapSerializationError);
    });
});
