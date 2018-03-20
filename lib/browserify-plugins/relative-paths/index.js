'use strict';

const relativePathTransform = require('./relative-path-transform');

module.exports = function outputFeed(browserify) {
    browserify.pipeline.get('deps').push(relativePathTransform());
};
