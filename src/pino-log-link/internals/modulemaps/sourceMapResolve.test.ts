import sourceMapResolve from './sourceMapResolve';

describe('findModulePath', () => {
    it('should return the correct path for a known module', () => {
        const pathMap = {
            'moduleA': '/path/to/moduleA',
            'moduleB': '/path/to/moduleB',
        };
        expect(sourceMapResolve('moduleA', pathMap)).toBe('/path/to/moduleA');
    });

    it('should return "not found!" for an unknown module', () => {
        const pathMap = {
            'moduleA': '/path/to/moduleA',
            'moduleB': '/path/to/moduleB',
        };
        expect(sourceMapResolve('moduleC', pathMap)).toBe('not found!');
    });
});

