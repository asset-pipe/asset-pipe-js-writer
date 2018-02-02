'use strict';

const common = require('asset-pipe-common');
const { Transform } = require('readable-stream');

module.exports = function idHashTransform(idToHashMap) {
    return new Transform({
        objectMode: true,
        transform(obj, enc, next) {
            idToHashMap[obj.id] = common.hasher(obj.source);
            this.push(obj);
            next();
        },
    });
};
