import { addLogLinkToFormatter } from "./addLogLinkToFormatter";

function setupLogLink(pinoConfig: any, moduleNameProp: string, moduleMapper: Function, baseURL: string, appendToProp: string = "msg"): any {
    let formatter = pinoConfig.formatters || {};
    formatter = addLogLinkToFormatter(formatter, 'log', moduleNameProp, moduleMapper, baseURL, appendToProp);
    pinoConfig.formatters = formatter;
    return pinoConfig;
}
export default setupLogLink;
