import chainFunction from './chainFunction';


/**
 * Pluck a property from an object and chain a series of functions to it.
 * The plucked property, if defined and a function wilkl be chained with the
 * rest of the functions.
 * Internally, this function uses the chainFunction function.
 * @returns The object, with the chained functions applied to the plucked property.
 */
export default function pluckAndChain(object: any, prop: string, ...funcs: ((o: any) => any)[]): any {
    object = object || {};
    const plucked: ((o: any) => any) | undefined = object[prop];
    // if plucked is a function , prepend it to the list of functions
    if (plucked && typeof plucked === 'function') {
        funcs.unshift(plucked);
    }
    // chain the functions together
    object[prop] = chainFunction(...funcs);
    return object;
}
