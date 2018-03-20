'use strict';

const { Transform } = require('readable-stream');
const { relative } = require('path');

module.exports = function idHashTransform() {
    return new Transform({
        objectMode: true,
        transform(obj, enc, next) {
            obj.file = relative(process.cwd(), obj.file);
            this.push(obj);
            next();
        },
    });
};
