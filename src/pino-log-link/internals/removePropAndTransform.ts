

export default function removePropAndTransform(object: any, prop: string, transformer: (o: any) => any): any {
    object = object || {};
    const plucked = object[prop];
    delete object[prop];
    const transformed = transformer(plucked);
    return { object: object, transformed: transformed };
};