"use strict";

const Browserify  = require('browserify'),
      JSONStream  = require('JSONStream'),
      UglifyJS    = require('uglify-js'),
      stream      = require('readable-stream'),
      shasum      = require('shasum');



const Writer = module.exports = function (files = [], options = {}, bundle = false) {
    const browserify = new Browserify(files, options);
    const dictionary = {};

    if (bundle) {
        return browserify;
    }

    const hasher = new stream.Transform({
        objectMode: true,
        transform: function (obj, enc, next) {
            dictionary[obj.id] = shasum(obj.source);
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


    // replace the step in browserifys build pipeline which convert the
    // internal dependency object structure to a browser bundle with a
    // simple conversion to JSON. this leave us with a stream of
    // dependencies we can pipe anywhere

    const packer = JSONStream.stringify();
    browserify.pipeline.get('pack').splice(0, 1, packer);

    return browserify;
};
