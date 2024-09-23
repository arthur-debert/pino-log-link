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
declare function chainFunction(...funcs: ((o: any) => any)[]): Function;
export default chainFunction;
