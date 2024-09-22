Pino Log Link add a link to each log entry inside dev tools on pino logs.

Usage:

1. Add genMap to your webpack config:
  ... plugins...
  new webpack.DefinePlugin({
            "process.env.MODULE_MAP": JSON.stringify(
                genMap(fs, path, srcDir, "webpack://astron/bigimg/src/")
            ),
        }),

logger.log( "whatever", { module: "ModuleName" } );


Limitations:
* No line number
* Webpack works out of the box (but it's simple to add support for other bundlers)
* You have to add the module name to each log entry
* If multiple modules have the same name, out of luck