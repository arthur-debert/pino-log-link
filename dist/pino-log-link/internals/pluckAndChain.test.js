import pluckAndChain from './pluckAndChain';
import chainFunction from './chainFunction';
jest.mock('./chainFunction');
describe('pluckAndChain', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        chainFunction.mockClear();
    });
    it('should return the object if it is null', () => {
        const object = null;
        const result = pluckAndChain(object, 'prop', () => { });
        expect(result).not.toBeNull();
        expect(chainFunction).toHaveBeenCalled();
    });
    it('should return the object if it is undefined', () => {
        const object = undefined;
        const result = pluckAndChain(object, 'prop', () => { });
        expect(result).not.toBeUndefined();
        expect(chainFunction).toHaveBeenCalled();
    });
    it('should set the property to the result of chainFunction if the property is not set', () => {
        const object = {};
        const funcA = () => { };
        const funcB = () => { };
        pluckAndChain(object, 'prop', funcA, funcB);
        expect(chainFunction).toHaveBeenCalledWith(funcA, funcB);
    });
    it('should prepend the plucked function to the list of functions if it is a function', () => {
        const propFunc = () => { };
        const funcA = () => { };
        const funcB = () => { };
        const object = {
            prop: propFunc
        };
        pluckAndChain(object, 'prop', funcA, funcB);
        expect(chainFunction).toHaveBeenCalledWith(propFunc, funcA, funcB);
    });
});
