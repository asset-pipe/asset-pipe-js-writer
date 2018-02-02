# asset-pipe-js-writer

[![Greenkeeper badge](https://badges.greenkeeper.io/asset-pipe/asset-pipe-js-writer.svg)](https://greenkeeper.io/)

This is an internal module intended for use by other modules in the [asset-pipe project][asset-pipe].

This module reads a [CommonJS module][commonjs] javascript file entry point and
resolves all the dependencies into an asset feed. It returns a [Browserify][browserify]
instance.

The output of this module can be passed into the [asset-pipe-js-reader][asset-pipe-js-reader] module
to build executable javascript bundles for the browser.

## Data format

The data format we use is called an asset feed and is also the internal data format used in [Browserify][browserify].

When Browserify resolves [CommonJS modules][commonjs] each dependency will be read and transformed
into an object which looks something like this:

```json
{
    "id": "c645cf572a8f5acf8716e4846b408d3b1ca45c58",
    "source":
        "\"use strict\";module.exports.world=function(){return\"world\"};",
    "deps": {},
    "file": "./assets/js/bar.js"
}
```

When you call `.bundle()` you get back a stream on which each such object is emitted. One for each dependency.

## Installation

```bash
$ npm install @asset-pipe/js-writer
```

## Usage

Read a [CommonJS module][commonjs] entry point and pipe the feed as JSON to a file on disk:

```js
const JSONStream = require('JSONStream');
const Writer = require('asset-pipe-js-writer');
const fs = require('fs');

const writer = new Writer('./js/browser.main.js');
writer
    .bundle()
    .pipe(JSONStream.stringify())
    .pipe(fs.createWriteStream('./feed/a.json'));
```

## API

This module has the following API:

### constructor(files, opts, bundle)

Supported arguments are:

* `files` - Same as `files` in the [Browserify constructor][browserify-opts] (required)
* `opts` - Same as `opts` in the [Browserify constructor][browserify-opts] with `dedupe` option set to `false` (this cannot be overriden). (optional). default: `{}`
* `bundle` - `boolean` - If `true` this module will output an executable javascript bundle instead of feed of dependencies. (optional). default: `false`.

Returns a `Browserify` instance.

**Examples**

```js
const writer = new Writer('./js/browser.main.js');
```

```js
const writer = new Writer(['./js/browser.main.js']);
```

```js
const writer = new Writer('./js/browser.main.js', { debug: true });
```

```js
const bundle = true;
const writer = new Writer('./js/browser.main.js', {}, bundle);
```

### .bundle()

Returns a stream of data.
If the writer was created with `bundle: true` this will be a javascript text bundle.
Otherwise the stream will be in object mode and each dependency will be emitted from the stream as an object.

Returns a readable stream.

**Example**

```js
writer.bundle().pipe(...)
```

## License

The MIT License (MIT)

Copyright (c) 2017 - Trygve Lie - post@trygve-lie.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[commonjs]: https://nodejs.org/docs/latest/api/modules.html
[asset-pipe]: https://github.com/asset-pipe
[browserify]: https://github.com/substack/node-browserify
[browserify-opts]: https://github.com/substack/node-browserify#browserifyfiles--opts
[browserify-plugin]: https://github.com/substack/node-browserify#bpluginplugin-opts
[browserify-transform]: https://github.com/substack/node-browserify#btransformtr-opts
[asset-pipe-js-reader]: https://github.com/asset-pipe/asset-pipe-js-reader
