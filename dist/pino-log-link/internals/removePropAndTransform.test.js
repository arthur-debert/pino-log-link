import removePropAndTransform from './removePropAndTransform';
describe('removeAndTransform', () => {
    it('should remove the property from the object', () => {
        const object = { a: 1, b: 2 };
        const result = removePropAndTransform(object, 'b', (x) => x * 2);
        expect(result["object"]).toEqual({ a: 1 });
        expect(result["transformed"]).toBe(4);
    });
    it('should work when the property is not defined', () => {
        const object = { a: 1 };
        const result = removePropAndTransform(object, 'b', (x) => x * 2);
        expect(result["object"]).toEqual({ a: 1 });
        expect(result["transformed"]).toBeNaN();
    });
    it('should work when the property is the only one in the object', () => {
        const object = { b: 2 };
        const result = removePropAndTransform(object, 'b', (x) => x * 2);
        expect(result["object"]).toEqual({});
        expect(result["transformed"]).toBe(4);
    });
});
