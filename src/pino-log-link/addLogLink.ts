import mapPropToUrl from "./mapPropToUrl";
import pluckAndChain from "./pluckAndChain";
/**
 /**
  * With a given pino configuration object, setup a log link.
  * This function will use the pinoConfig["formatters"]["log"](logRecord : any)
  * function. It will remove the moduleName from logRecord[moduleNameProp] , use
  * fromModuleToFileUrl and append it to the logRecord[appendToProp] property.
  * It can generate the moduleMap from a moduleMapper function.
  *
  * Remember that , if one is present, the pinoConfig["formatters"]["log"] function
  * should be called after we're done. For this we will use pluckAndChain.
  * The final function should return the modified logRecord..
  */
function addLogLink(pinoConfig: any, formatterName: string, moduleNameProp: string, moduleMapper: Function,
    baseURL: string, appendToProp: string): any {
    const moduleMap = moduleMapper();
    const tagAppender = (logRecord: any) => {
        return mapPropToUrl(logRecord, moduleNameProp, baseURL, moduleMap, appendToProp);
    };
    pinoConfig.formatters = pinoConfig.formatters || {};
    return pluckAndChain(pinoConfig.formatters, formatterName, tagAppender);
}


export default addLogLink;
