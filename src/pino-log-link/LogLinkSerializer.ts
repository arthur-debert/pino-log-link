import { Serializer, LogMessage } from "./types";

const LogLinkSerializer: Serializer = {
    recordFunc: (record: LogMessage): LogMessage => {
        const msg: string = record.module ? record.msg + ` ${record.module}` : record.msg;
        console.log(msg);
        delete record.module;
        return record;
    },
    fieldFunc: (value: any) => {
        // MODULE_MAP has to be injected in the build process
        // currently it's a webpack define plugin
        const MODULE_MAP = process.env.MODULE_MAP;
        if (MODULE_MAP && MODULE_MAP[value]) {
            value = MODULE_MAP[value];
        }
        return `${value}`;
    }
};

export default LogLinkSerializer;