'use strict';

const { PassThrough } = require('readable-stream');

module.exports = function outputFeed(browserify) {
    browserify.pipeline
        .get('pack')
        .splice(0, 1, new PassThrough({ objectMode: true }));
};
