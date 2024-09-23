import findModulePath from './findModulePath';
describe('findModulePath', () => {
    it('should return the correct path for a known module', () => {
        const pathMap = {
            'moduleA': '/path/to/moduleA',
            'moduleB': '/path/to/moduleB',
        };
        expect(findModulePath('moduleA', pathMap)).toBe('/path/to/moduleA');
    });
    it('should return "not found!" for an unknown module', () => {
        const pathMap = {
            'moduleA': '/path/to/moduleA',
            'moduleB': '/path/to/moduleB',
        };
        expect(findModulePath('moduleC', pathMap)).toBe('not found!');
    });
});
