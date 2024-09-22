import removeTransformAppend from './removeTransformAppend';



describe('removeTransformAppend', () => {
    it('should remove the property from the object and append the transformed value to the specified property (array)', () => {
        const object = { a: 1, b: 2, c: [3] };
        const result = removeTransformAppend(object, 'b', (x) => x * 2, 'c');
        expect(result).toEqual({ a: 1, c: [3, 4] });
    });

    it('should remove the property from the object and append the transformed value to the specified property (string)', () => {
        const object = { a: 1, b: 2, c: 'hello' };
        const result = removeTransformAppend(object, 'b', (x) => x * 2, 'c');
        expect(result).toEqual({ a: 1, c: 'hello 4' });
    });

    it('should work when the property to append to is initially undefined', () => {
        const object = { a: 1, b: 2 };
        const result = removeTransformAppend(object, 'b', (x) => x * 2, 'c');
        expect(result).toEqual({ a: 1, c: 4 });
    });

    it('should work when the property to append to is initially null', () => {
        const object = { a: 1, b: 2, c: null };
        const result = removeTransformAppend(object, 'b', (x) => x * 2, 'c');
        expect(result).toEqual({ a: 1, c: 4 });
    });
});
