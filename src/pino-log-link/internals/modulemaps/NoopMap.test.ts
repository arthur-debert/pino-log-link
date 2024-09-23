import NoopMap from './NoopMap';


describe('NoopMap', () => {
    let map: NoopMap;
    beforeEach(() => {
        map = new NoopMap();
    });

    it('should return the key as the value for any key accessed', () => {
        expect(map['foo'] as any).toBe('foo');
        expect(map['bar']).toBe('bar');
        expect(map['baz']).toBe('baz');
    });


    it('should still return the key for non-default keys', () => {
        const defaultMap = new NoopMap();
        defaultMap['default'] = 'default value';
        expect(defaultMap['foo']).toBe('foo');
    });
});
