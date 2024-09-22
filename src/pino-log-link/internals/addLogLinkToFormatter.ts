import mapPropToUrl from "./mapPropToUrl";
import pluckAndChain from "./pluckAndChain";
/**
 /**
  * Transforms pinoConfig to include a formatter that gets the module name from
  * the log record and appends it to the log message as a link.
  * This is an internal function, end users should use the addLogLink function.
  */
export function addLogLinkToFormatter(formatFunctionContainer: any, formatterName: string, moduleNameProp: string, moduleMapper: Function,
    baseURL: string, appendToProp: string): any {
    const moduleMap = moduleMapper();
    const tagAppender = (logRecord: any) => {
        return mapPropToUrl(logRecord, moduleNameProp, baseURL, moduleMap, appendToProp);
    };
    formatFunctionContainer.formatters = formatFunctionContainer.formatters || {};
    return pluckAndChain(formatFunctionContainer.formatters, formatterName, tagAppender);
}

