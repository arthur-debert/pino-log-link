/**
 * Pluck a property from an object and chain a series of functions to it.
 * The plucked property, if defined and a function wilkl be chained with the
 * rest of the functions.
 * Internally, this function uses the chainFunction function.
 * @returns The object, with the chained functions applied to the plucked property.
 */
export default function pluckAndChain(object: any, prop: string, ...funcs: ((o: any) => any)[]): any;
