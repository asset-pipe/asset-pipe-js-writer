'use strict';

const Browserify = require('browserify');
const outputFeed = require('./browserify-plugins/output-feed');
const idHasher = require('./browserify-plugins/id-hasher');
const assert = require('assert');
const { name } = require('../package.json');

module.exports = class Writer {
    constructor(files, options = {}, bundle = false) {
        assert(
            Array.isArray(files) || typeof files === 'string',
            `Expected 'files' argument to ${name} constructor to be either a string or an array. Instead got '${typeof files}'`
        );
        assert(
            typeof options === 'object',
            `Expected optional 'options' argument to ${name} constructor to be an object. Instead got '${typeof options}'`
        );
        assert(
            typeof bundle === 'boolean',
            `Expected optional 'bundle' argument to ${name} constructor to be a boolean. Instead got '${typeof bundle}'`
        );

        const opts = { dedupe: false, ...options };
        const browserify = new Browserify(files, opts);
        if (bundle) return browserify;
        return browserify.plugin(idHasher).plugin(outputFeed);
    }
};
