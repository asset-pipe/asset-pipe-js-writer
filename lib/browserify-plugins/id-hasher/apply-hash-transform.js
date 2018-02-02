'use strict';

const { Transform } = require('readable-stream');

module.exports = function applyHashTransform(idToHashMap) {
    return new Transform({
        objectMode: true,
        transform(obj, enc, next) {
            obj.id = idToHashMap[obj.id];
            for (const dependency of Object.keys(obj.deps)) {
                obj.deps[dependency] = idToHashMap[obj.deps[dependency]];
            }
            this.push(obj);
            next();
        },
    });
};
