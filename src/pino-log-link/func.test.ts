import chainFunction from './chainFunction';



describe('chainFunction', () => {
    it('should return fA if fB is not defined', () => {
        const fA = (o: any) => ({ ...o, a: 'a' });
        const result = chainFunction(fA, undefined as any);
        expect(result({ b: 'b' })).toEqual({ a: 'a', b: 'b' });
    });

    it('should return fB if fA is not defined', () => {
        const fB = (o: any) => ({ ...o, b: 'b' });
        const result = chainFunction(undefined as any, fB);
        expect(result({ a: 'a' })).toEqual({ a: 'a', b: 'b' });
    });

    it('should throw an error if both fA and fB are not defined', () => {
        expect(() => chainFunction(undefined as any, undefined as any)).toThrow();
    });

    it('should chain fA and fB together', () => {
        const fA = (o: any) => ({ ...o, a: 'a' });
        const fB = (o: any) => ({ ...o, b: 'b' });
        const result = chainFunction(fA, fB);
        expect(result({})).toEqual({ a: 'a', b: 'b' });
    });

    it('should call fA with the input and fB with the output of fA', () => {
        const fA = jest.fn((o: any) => ({ ...o, a: 'a' }));
        const fB = jest.fn((o: any) => ({ ...o, b: 'b' }));
        const result = chainFunction(fA, fB);
        result({ c: 'c' });
        expect(fA).toHaveBeenCalledWith({ c: 'c' });
        expect(fB).toHaveBeenCalledWith({ a: 'a', c: 'c' });
    });
    it('should chain 5 functions together', () => {
        const fA = jest.fn((o: any) => ({ ...o, a: 'a' }));
        const fB = jest.fn((o: any) => ({ ...o, b: 'b' }));
        const fC = jest.fn((o: any) => ({ ...o, c: 'c' }));
        const fD = jest.fn((o: any) => ({ ...o, d: 'd' }));
        const fE = jest.fn((o: any) => ({ ...o, e: 'e' }));
        const result = chainFunction(fA, fB, fC, fD, fE);
        result({});
        expect(fA).toHaveBeenCalledWith({});
        expect(fB).toHaveBeenCalledWith({ a: 'a' });
        expect(fC).toHaveBeenCalledWith({ a: 'a', b: 'b' });
        expect(fD).toHaveBeenCalledWith({ a: 'a', b: 'b', c: 'c' });
        expect(fE).toHaveBeenCalledWith({ a: 'a', b: 'b', c: 'c', d: 'd' });
    });

});

describe('chainFunction non defined', () => {
    // ... existing tests ...
    it('should chain 5 functions, filtering out undefined ones', () => {
        const fA = jest.fn((o: any) => ({ ...o, a: 'a' }));
        const fB = jest.fn((o: any) => ({ ...o, b: 'b' }));
        const fC = jest.fn((o: any) => ({ ...o, c: 'c' }));
        const result = chainFunction(fA, undefined as any, fB, undefined as any, fC);
        result({});
        expect(fA).toHaveBeenCalledWith({});
        expect(fB).toHaveBeenCalledWith({ a: 'a' });
        expect(fC).toHaveBeenCalledWith({ a: 'a', b: 'b' });
    });
    it('should throw an error if an empty array is passed', () => {
        expect(() => chainFunction(...[])).toThrow();
    });

    it('should throw an error if an array with all undefined or null items is passed', () => {
        expect(() => chainFunction(undefined as any, null as any, undefined as any)).toThrow();
    });
});
