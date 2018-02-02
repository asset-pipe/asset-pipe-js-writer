'use strict';

const Browserify = require('browserify');
const stream = require('readable-stream');
const common = require('asset-pipe-common');
const uglify = require('uglify-js');

module.exports = class Writer {
    constructor(files = [], options = {}, bundle = false, minify = false) {
        const browserify = new Browserify(files, options);
        const dictionary = {};

        if (bundle) {
            return browserify;
        }

        const hasher = new stream.Transform({
            objectMode: true,
            transform(obj, enc, next) {
                dictionary[obj.id] = common.hasher(obj.source);
                this.push(obj);
                next();
            },
        });
        browserify.pipeline.get('deps').push(hasher);

        const labeler = new stream.Transform({
            objectMode: true,
            transform(obj, enc, next) {
                obj.id = dictionary[obj.id];
                Object.keys(obj.deps).forEach(key => {
                    obj.deps[key] = dictionary[obj.deps[key]];
                });
                this.push(obj);
                next();
            },
        });
        browserify.pipeline.get('label').splice(0, 1, labeler);

        // Replace the step in browserifys build pipeline which convert the
        // internal dependency object structure to a browser bundle transform
        // which just pipes objects through. This leave us with a stream of
        // dependency objects we can pipe anywhere

        const packer = new stream.Transform({
            objectMode: true,
            transform(obj, enc, next) {
                if (minify) {
                    const minified = uglify.minify(obj.source, {
                        fromString: true,
                    });
                    if (minified.code) {
                        obj.source = minified.code;
                    }
                }
                this.push(obj);
                next();
            },
        });
        browserify.pipeline.get('pack').splice(0, 1, packer);

        return browserify;
    }
};
