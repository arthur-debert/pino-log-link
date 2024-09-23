/**
 /**
  * Transforms pinoConfig to include a formatter that gets the module name from
  * the log record and appends it to the log message as a link.
  * This is an internal function, end users should use the addLogLink function.
  */
export declare function addLogLinkToFormatter(formatFunctionContainer: any, formatterName: string, moduleNameProp: string, moduleMapper: Function, baseURL: string, appendToProp: string): any;
