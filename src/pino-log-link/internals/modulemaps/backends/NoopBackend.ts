import NoopMap from "../NoopMap";
import { AbstractStorageBackend } from "./AbstractStorageBackend";


export default class NoopBackend extends AbstractStorageBackend {
    map: any;
    constructor() {
        super({});
        this.map = new NoopMap();
    }
    store() {
        return Promise.resolve();
    }
    fetch() {
        return Promise.resolve(this.map);
    }
}
