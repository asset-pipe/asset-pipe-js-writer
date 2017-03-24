# asset-pipe-js-writer

This is an internal module intended for use by other modules in the [asset-pipe project][asset-pipe].

This module reads a [CommonJS module][commonjs] entry point for javascript files and
resolvs all the dependencies into an asset feed. It returns an [Browserify][browserify]
instance.

[Browserify][browserify] will normally parse [CommonJS modules][commonjs] into a executable
javascript bundle for the browser. This module intercepts the internal build pipeline in
[Browserify][browserify] just before each dependency are transformed into plain javascript
and gives us a stream of dependency objects which can be piped to any other stream for further
processing.

Example; the output of this module can be piped into the [asset-pipe-js-reader][asset-pipe-js-reader]
module to build executable javascript bundles for the browser.



## Data format

What we refere to as an asset feed is the internal data format used in [Browserify][browserify].

When a [CommonJS module][commonjs] entry point is provided all dependencies from that entry point
will be read and transformed into an object which looks something like this:

```json
{
    "id":"c645cf572a8f5acf8716e4846b408d3b1ca45c58",
    "source":"\"use strict\";module.exports.world=function(){return\"world\"};",
    "deps":{},
    "file":"./assets/js/bar.js"
}
```

This module does stream read dependencies and emit the following object for each
dependency. This is the asset feed.



## Installation

```bash
$ npm install asset-pipe-js-writer
```



## Usage

Read an entry point and pipe the feed to a JSON on `stdout`:

```js
const JSONStream = require('JSONStream');
const Writer = require('asset-pipe-js-writer');

const writer = new Writer('./js/main.js');
writer.bundle().pipe(JSONStream.stringify()).pipe(process.stdout);
```



## API

This module have the following API:

### constructor(files, opts, bundle, minify)

Supported arguments are:

 * `files` - Same as `files` in the [Browserify constructor][browserify-opts]
 * `opts` - Same as `opts` in the [Browserify constructor][browserify-opts]
 * `bundle` - Boolean - If `true` this module will output a executable javascript bundle. Default: `false`.
 * `minify` - Boolean - If `true` the `source` in the asset feed will be minified. Default: `false`.

### transform()

Same as the [Browserify transform][browserify-transform] method.

### plugin()

Same as the [Browserify plugin][browserify-plugin] method.



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
[browserify-plugin]: https://github.com/substack/node-browserify#bpipeline
[browserify-transform]: https://github.com/substack/node-browserify#btransformtr-opts
[asset-pipe-js-reader]: https://github.com/asset-pipe/asset-pipe-js-reader
