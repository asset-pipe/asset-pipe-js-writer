"use strict";

const Browserify = require('browserify');
const UglifyJS = require('uglify-js');
const stream = require('readable-stream');
const common = require('asset-pipe-common');


class Writer {
    constructor (files = [], options = {}, bundle = false) {
        const browserify = new Browserify(files, options);
        const dictionary = {};

        if (bundle) {
            return browserify;
        }

        const hasher = new stream.Transform({
            objectMode: true,
            transform: function (obj, enc, next) {
                dictionary[obj.id] = common.hasher(obj.source);
                this.push(obj);
                next();
            }
        });
        browserify.pipeline.get('deps').push(hasher);


        const labeler = new stream.Transform({
            objectMode: true,
            transform: function (obj, enc, next) {
                obj.id = dictionary[obj.id];
                Object.keys(obj.deps).forEach((key) => {
                    obj.deps[key] = dictionary[obj.deps[key]];
                });
                this.push(obj);
                next();
            }
        });
        browserify.pipeline.get('label').splice(0, 1, labeler);


        // Replace the step in browserifys build pipeline which convert the
        // internal dependency object structure to a browser bundle transform
        // which just pipes objects through. This leave us with a stream of
        // dependency objects we can pipe anywhere

        const packer = new stream.Transform({
            objectMode: true,
            transform: function (obj, enc, next) {
                this.push(obj);
                next();
            }
        });
        browserify.pipeline.get('pack').splice(0, 1, packer);

        return browserify;
    }
}

module.exports = Writer;
