/**
 * Webpack plugin that generates a module map of the project's source files.
 *
 * @example
 ```js
const path = require('path');
const WebPackModuleMapPlugin = require('./path/to/WebpackModuleMapPlugin'); // Adjust path

module.exports = {
  // ... your other Webpack config ...

  plugins: [
    new WebPackModuleMapPlugin({
      rootDirectory: path.resolve(__dirname, 'src'), // Path to your source code
      outputFileName: 'module-map.json', // Optional: Customize output filename
      // includeExtensions: [...] // Optional: Customize included extensions
    }),
  ],
};
```
 */
import * as path from 'path';
import { Compiler, WebpackPluginInstance } from 'webpack';
import generateModuleMap from '../../generateModuleMap';


interface ModuleMapPluginOptions {
    rootDirectory: string;
    outputFileName?: string;
    includeExtensions?: string[];
}

class WebPackModuleMapPlugin implements WebpackPluginInstance {
    private readonly rootDirectory: string;
    private readonly outputFileName: string;
    private readonly includeExtensions: string[];

    constructor(options: ModuleMapPluginOptions) {
        this.rootDirectory = options.rootDirectory;
        this.outputFileName = options.outputFileName || 'module-map.json';
        this.includeExtensions = options.includeExtensions || [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.mjs',
            '.cjs',
            '.mts',
            '.cts',
        ];
    }

    apply(compiler: Compiler) {
        compiler.hooks.emit.tapAsync(
            'ModuleMapPlugin',
            (compilation: { assets: { [x: string]: { source: () => string; size: () => number; }; }; }, callback: () => void) => {
                const moduleMap = generateModuleMap(
                    this.rootDirectory,
                    this.includeExtensions
                );

                const jsonModuleMap = JSON.stringify(moduleMap);

                // Add the module map as an asset to the compilation
                compilation.assets[this.outputFileName] = {
                    source: () => jsonModuleMap,
                    size: () => jsonModuleMap.length,
                };

                callback();
            }
        );
    }
}

export default WebPackModuleMapPlugin;
