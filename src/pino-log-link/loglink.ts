import LogLinkSerializer from "./LogLinkSerializer";
import { LogMessage, PinoConfig, PinoConfigPost, SerializerConf } from "./types";

/*
 * This will add all the serializers reqeuested to the pino instance.
 * Some serializer may have a post processor  a function that needs to receive
 * the entire log record after all the serializers have been applied.
 *
 * This is a multi-step process:
 * 1. The config.browser.asObject must be  set to true
 * 2. The config.browser.serialize must be set to an array of the keys of the serializers
 * 3.  The config.serializers must be set to an object with the keys being the name of the field on
 *  the record and the value being field serializer function.
 *
 * Do these serializers have post processors? If so:
 *
 * 4. Store any existing write function in the pino instance
 * 5. Chain all the post processors together0w0
 * 6. Wrap all the processors and the final write function in a single function
 *
 * @param config the pino configuration object
 * @param serializers an object with the keys being the name of the field on
 * the record and the value being the serializer object.
 * @return the updated pino configuration object
 /*
 */
export function addSerializers(config: PinoConfig, serializers: SerializerConf): PinoConfigPost {
    // first we need to add the serializers to the logger
    // create the browser object if it doesn't exist
    if (!config.browser) {
        config.browser = { asObject: false, serialize: [] };
    } else if (!config.browser.serialize) {
        config.browser.serialize = [];
    }

    config.browser.asObject = true;
    config.browser.serialize = [...(config.browser.serialize || []), ...Object.keys(serializers)];

    // If config.serializers doesn't exist, initialize it as an empty object
    config.serializers = config.serializers || {};
    config.serializers = { ...config.serializers, ...Object.fromEntries(Object.entries(serializers).map(([key, value]) => [key, value.fieldFunc])) };

    let previous: Function | null = config.browser.write || console.log
    let recordProcessors = Object.values(serializers).map(serializer => serializer.recordFunc).filter(record => record !== undefined);
    function chainedProcessors(writeFunc: Function, postProcessors: Function[]) {
        return function (record: LogMessage) {
            const result = postProcessors.reduce((acc, postProcessor) => postProcessor(acc, writeFunc), record);
            return (previous ? previous(result) : result);

        };
    }
    config.browser.write = chainedProcessors(previous, recordProcessors) as (record: any) => any;
    return config as PinoConfigPost;
}


export default function addLogLink(config: any, propName: string = 'module') {
    addSerializers(config, { propName: LogLinkSerializer });
}