export interface LogMessage {
    msg: string;
    time: number;
    module?: string;
    tag?: string[];
}


export interface Serializer {
    fieldFunc: (value: any) => any;
    recordFunc?: (record: LogMessage) => LogMessage;
}
;

export type SerializerConf = {
    [key: string]: Serializer;
};
interface PinoBrowserConfig {
    asObject?: boolean;
    serialize?: string[];
    write?: (writeFunc: Function, postProcessors: Function[]) => (record: LogMessage) => LogMessage;
}

export interface PinoConfig {
    browser?: PinoBrowserConfig & {
        [key: string]: any; // Allow any other properties within 'browser'
    };
    serializers?: {
        [key: string]: any;
    };
}
interface PinoBrowserConfigPost {
    asObject: boolean;
    serialize: string[];
    write: (writeFunc: Function, postProcessors: Function[]) => (record: LogMessage) => LogMessage;

}
export interface PinoConfigPost {
    browser: PinoBrowserConfigPost
    serializers: {
        [key: string]: any;
    };
}

