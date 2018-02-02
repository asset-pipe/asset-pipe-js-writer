'use strict';

const idHashTransform = require('./id-hash-transform');
const applyHashTransform = require('./apply-hash-transform');

module.exports = function outputFeed(browserify) {
    const idToHashMap = {};
    browserify.pipeline.get('deps').push(idHashTransform(idToHashMap));
    browserify.pipeline
        .get('label')
        .splice(0, 1, applyHashTransform(idToHashMap));
};
