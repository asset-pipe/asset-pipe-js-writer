'use strict';

module.exports = function getStream(stream) {
    const objects = [];
    let strings = '';
    return new Promise((resolve, reject) => {
        stream.once('error', reject);
        stream.on('data', chunk => {
            if (Buffer.isBuffer(chunk)) strings += chunk.toString();
            else objects.push(chunk);
        });
        stream.on('end', () => {
            if (strings) resolve(strings);
            else resolve(objects);
        });
    });
};
