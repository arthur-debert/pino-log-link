/**
 * Removes "prop" from object, transforms it with "transformer" and appends it to "appendToProp".
 * Uses the removeAndTransform function internally.
 */
declare function removeTransformAppend(object: any, prop: string, transformer: (o: any) => any, appendToProp: string): any;
export default removeTransformAppend;
