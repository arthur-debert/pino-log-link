import pino from 'pino';
import addLogLink from './pino-log-link/loglink';


let config = {}


addLogLink(config, "module")
const logger = pino(config);


logger.info({ module: "logger", tag: "meta" }, "Hello log. ")
logger.info({ module: "logger", tag: "other" }, "Hello log. ")

