export default function removePropAndTransform(object, prop, transformer) {
    object = object || {};
    const plucked = object[prop];
    delete object[prop];
    const transformed = transformer(plucked);
    return { object: object, transformed: transformed };
}
;
