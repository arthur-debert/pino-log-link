/**
 * A map that returns the key as the value.
 * This is useful for keeping the same interface as a regular map.
 * but not actually storing any values.
 */
export default class NoopMap {
    [key: string]: string;

    constructor() {
        return new Proxy(this, {
            get: (target, prop, receiver) => {
                if (typeof prop === 'string') {
                    return prop;
                }
                return Reflect.get(target, prop, receiver) as string;
            },
            set: (target, prop, value, receiver) => {
                if (typeof prop === 'string') {
                    return true;
                }
                return Reflect.set(target, prop, value, receiver);
            },
        });
    }
}