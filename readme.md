# Pino Log Link

Pino Log Link adds a link to each log entry to the file that generated it.

Pino is the de-facto logging solution for larger js apps, with its performance and flexibility.
If you're using Pino on the backend, it makes perfect sense to use it on your
web frontend, keeping things in symmetry and reusing tooling and reporting.

However, once you do, log entries, in the browser, will no longer have a like to
the file that generated them, which is a pity, since it's so useful.

## Usage

This library adds that link for each log entry, with minimal effort on you part.
Here's how to use it:

### 1. Log Messages

Add the module's name to any prop you choose on your log objects:
   `logger.log( { module: 'MyModule', msg: 'hello' } );`
This also works for the regular message as text / meta as object form as well:
   `logger.log( "Hello", { module: 'MyModule'} );`

Note that you don't need to type the fully qualified module path, just the module name. Most IDE's will auto-complete this, so it's pretty low effort.

### 2 Setup the logger

Pino-log-link works by hooking into the formatters.log method of the Pino logger config. It's smart enough not to mess with anything else, it will keep previous function calls in formatters.log working after it's done setup.

First do all the setup on you config object as you normally would:

```javascript
   const pinoConfig = {
      // do what you must
   }
```

Then do the setup with the prop name you've chosen to store module into and the url for the link:

```javascript
   const pinoConfigLinked = setupLogLink( pinoConfig, 'module',  'http://webpack/', sourceMapManager);
   logger = pino(pinoConfigLinked)
```

The sourceMapManager requires decisions on your end, see (The Source Map)

### 3. Results

The log entry will have a link to the file that generated it:
   `{ msg: 'hello http://localhost:3000/MyModule.ts' }`

### 4. The Source Map

At it's core, this lib is in interface for turning a reference to a module to a url with the
matching file.

That requires a mapping, between modules -> files -> in browser url.
This is achieved by creating a SourceMapManager. It will take care of both the generation, retrieval and resolving of modules to urls.

A SourceMapManger takes a generator and a backend to work.

There are two very simple ways to do this:

**a) Use qualified module paths in entries.**
Say:

* Src code's root is at `(...)/src`
* You're bundler / server maps that path to say, `http://webpack/app/`
* A module at src/package1/package2/SomeModule.js  will map to `http://webpack/app/package1/package2/SomeModule.js`

If you tag a commit with "module": "/package1/package2/SomeModule.js"  a path->url is all that's needed. And it should work. That is a noop map. This is what you want:

```javascript
const mapManager = await new SourceMapManager(NoopGenerator, NoopBackend)
```

**b) Use the bundler's source map and process env variables.**

This is the best choice for most people, since it involves no setup while giving you actual mapping.

```javascript
const mapManager = await new SourceMapManager(SourceMapGenerator, EnvBackend)
```

That , however, is far from ideal. Path's get pretty deep. They also change as one refactors code. Thus, keeping those fully qualified paths is ongoing work.
Tagging the module's name is less typing, less error prone and less likely to change, a reasonable bang for buck compromise.

That, however, needs a map to figure out the full path from a module's name, which can later be translated into an url.

So, pino-llink has a few options for that. Let's walk through some of them.

There are two parts to this: how the map gets generated and how the library

#### 1. Source Maps

We mean *the* source maps web applications already use. You're already using them, and they carry the information we need.

## Limitations

Source linking can't be fully done via user land code, it has to access internal machinery
of the runtime or compiler. This library does neither, hence it does have some limitations. Namely:

* Line numbers are not included.
* The need to manually append the module's name to entries.
* Either some work on your bundler, or the incurred cost of an extra http request for source maps.

Hopefully, it's still useful enough to warrant the extra work.

Happy logging.
