/**
 * Adds a link to the log entry message poiting to the originating module that will
 * work in the browser's devtools.

 * This function should be called in the pino configuration object, prior to
 * creating the pino logger.
 * Previous formatters.log functions will be preserved, and the new one will be
 *  added to the formatters object.
 * The final log record will have the url appended to the message (that's how
 * the browser devtools will know how to open the file).
 *
 * @example:
 * ```javascript
 *  // setup your logger
 *  logger = pino(setupLogLink( 'module', () => moduleMap, 'http://localhost:3000/'));
 *  // log a message
 *  logger.log( { module: 'MyModule', message: 'hello' } );
 *  // the final log record will be:
 *  message: 'hello http://localhost:3000/MyModule.ts' }
* ```
 *
 * @param pinoConfig  The pino configuration object, can be pre-existing or not.
 * @param moduleNameProp The property name in the log record that contains the module name.
 * @param moduleMapperFunc A function that returns the module map object.
 * @param baseURL The base URL that will be used to create the file URL.
 * @returns The modified pino configuration object.
 */
declare function setupLogLink(pinoConfig: any, moduleNameProp: string, moduleMapperFunc: Function, baseURL: string, appendToProp?: string): any;
export default setupLogLink;
