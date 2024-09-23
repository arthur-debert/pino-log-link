import removePropAndTransform from "./removePropAndTransform";
/**
 * Removes "prop" from object, transforms it with "transformer" and appends it to "appendToProp".
 * Uses the removeAndTransform function internally.
 */
function removeTransformAppend(object, prop, transformer, appendToProp) {
    const result = removePropAndTransform(object, prop, transformer);
    object = result.object;
    if (object && result.transformed !== undefined) {
        if (Array.isArray(object[appendToProp])) {
            object[appendToProp].push(result.transformed);
        }
        else {
            object[appendToProp] = object[appendToProp] ? `${object[appendToProp]} ${result.transformed}` : result.transformed;
        }
    }
    return object;
}
export default removeTransformAppend;
