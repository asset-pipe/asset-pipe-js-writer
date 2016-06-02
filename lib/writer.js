"use strict";

const   stream      = require('readable-stream'),
        mdeps       = require('module-deps'),
        UglifyJS    = require('uglify-js'),
        shasum      = require('shasum'),
        assert      = require('assert'),
        pump        = require('pump');



const Writer = module.exports = function (file, minify) {

    if (!(this instanceof Writer)) return new Writer(file, minify);

    assert(file, '"file" must be provided');

    let start = process.hrtime();

    let md = mdeps();
    let dictionary = {};


    let hasher = new stream.Transform({
        objectMode : true,

        transform: function (obj, enc, next) {
            dictionary[obj.id] = shasum(obj.source);
            this.push(obj);
            next();
        }

    });


    let labeler = new stream.Transform({
        objectMode : true,

        transform: function (obj, enc, next) {
            obj.id = dictionary[obj.id];
            Object.keys(obj.deps).forEach((key) => {
                obj.deps[key] = dictionary[obj.deps[key]];
            });
            this.push(obj);
            next();
        }

    });


    let minifyer = new stream.Transform({
        objectMode : true,

        transform: function (obj, enc, next) {
            if (minify) {
                let minified = UglifyJS.minify(obj.source, {
                    fromString: true
                });
                obj.source = minified.code;                
            }
            this.push(obj);
            next();
        }

    });

    md.end({file: file});

    return pump(md, hasher, labeler, minifyer, (err) => {
        let end = process.hrtime(start);
        console.log("time:", end[0] + 'sec', end[1]/1000000 + 'ms');
    });
};
