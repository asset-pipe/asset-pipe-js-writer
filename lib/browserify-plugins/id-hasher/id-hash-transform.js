'use strict';

const common = require('asset-pipe-common');
const { Transform } = require('readable-stream');
const { relative } = require('path');

module.exports = function idHashTransform(idToHashMap) {
    return new Transform({
        objectMode: true,
        transform(obj, enc, next) {
            // include id and source in hash to avoid situation where
            // multiple modules have the same source code but different
            // dependencies somewhere down the line.
            idToHashMap[obj.id] = common.hasher(
                relative(process.cwd(), obj.id) + obj.source
            );
            this.push(obj);
            next();
        },
    });
};
