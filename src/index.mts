import pino from 'pino';


let config: any = {
    formatters: {
        log(o: any) {
            const tag = o.tag || "default"
            console.log("from formatter", o)
            return {
                msg: "nay + " + tag,
                tag: tag,
                module: o.module
            }
        }
    }
}
const logger = pino(config);


//logger.info("Hello log text only")
logger.info({ module: "logger", tag: "other" }, "Hello log. ")


