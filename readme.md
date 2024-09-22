# Pino Log Link

Pino Log Link adds a link to each log entry to the file that generated it .

## Usage

### 1. Setup the logger

```javascript
   const pinoConfig = {} // can be pre configured.
   const pinoConfigLinked = setupLogLink( pinoConfig, 'module', () => moduleMap, 'http://localhost:3000/');
   logger = pino(pinoConfigLinked)
```

### 2. Log Messages

Add the module name to your entries with the prop name you've chosen:
   `logger.log( { module: 'MyModule', msg: 'hello' } );`

### 3. Results

The log entry will have a link to the file that generated it:
   `{ msg: 'hello http://localhost:3000/MyModule.ts' }`

### 4. Connect the source map

This is the only thing that must run on the server. You can use the generateSource map from a WebPack plugin:

  ```javascript
  //... plugins...
  new webpack.DefinePlugin({
            "process.env.MODULE_MAP": JSON.stringify(
                generateModuleMap(rootDirectory)
            ),
        }),
```

## Limitations

While quick and dirty, this is functional and makes life so much easier.
It's not, however, without its limitations. Namely:

* You do need to add the module name to your log entries ( no need to enter the full path). Most IDE's will autocomplete this for you..
* No line numbers are included.
* WebPack works out of the box , but for other setups , you need to plug the source map generator.

Enjoy!
