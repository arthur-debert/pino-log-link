/**
 * Reads the property propName from object and maps it to a URL, using maps and base URL.
 * It will also append the URL to the appendToProp property.
 * At this point we're reaching the higher levels of our goals here.
 *
 * Log records will be generated with structured objects. One of these props will be the moddule's name.
 * We're going to pluck this prop, transform it into the url and append it to another prop.
 *
 * Say that we have a log recorde like this:
 * { module: 'moduleA', message: 'something happened' }
 * And say that in our map, moduleA maps to /some/path/moduleA.ts and our base URL is http://localhost:3000/
 * if we cann this with mapPropToUrl(logRecord, 'module', 'http://localhost:3000/', moduleMap, 'message')
 * we want to heve the original prop removed and the log record transformed to:
 * {  message: 'something happened http://localhost:3000/some/path/module.A' }.
 * Internally we're going to use the removeTransformAppend function and the fromModuleToFileURL function.
 */
declare function mapPropToUrl(object: any, propName: string, baseURL: string, moduleMap: Record<string, string>, appendToProp: string): any;
export default mapPropToUrl;
