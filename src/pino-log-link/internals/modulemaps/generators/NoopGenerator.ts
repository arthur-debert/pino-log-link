
import { AbstractSourceMapGenerator } from "../AbstractSourceMapGenerator";


export default class NoopGenerator extends AbstractSourceMapGenerator {
    constructor(source?: string) {
        super(source || "");
    }
    generate() {
        return Promise.resolve({})
    }
}

