/**
 * Chains an arbitrary number of functions together, returning a new function
 * that calls each function in sequence, passing the output of one function
 * as the input to the next.
 *
 * If a function is not defined, it is skipped.
 * If no functions are defined, an error is thrown.
 *
 * @param funcs - The functions to chain together.
 * @throws Error if no functions are defined.
 * @returns A new function that chains the input functions.
 */
function chainFunction(...funcs: ((o: any) => any)[]): Function {
    // if no functions are defined, throw an error
    if (funcs.length === 0) {
        throw new Error("At least one function must be defined");
    }

    // filter out any undefined functions
    const validFuncs = funcs.filter((func) => typeof func === 'function');

    // if no valid functions are found, throw an error
    if (validFuncs.length === 0) {
        throw new Error("At least one valid function must be defined");
    }

    // return a new function that chains the valid functions together
    return function (o: any) {
        return validFuncs.reduce((acc, func) => func(acc), o);
    };
}

export default chainFunction;
