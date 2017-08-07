'use strict';

const JSONStream = require('JSONStream');
const tap = require('tap');
const Writer = require('../');

tap.test('foo() - bar', (t) => {
    const writer = new Writer('./test/mock/main.js', {}, false, false);
    writer.bundle()
        .pipe(JSONStream.stringify())
        .pipe(process.stdout);

    t.equal(true, true);
    t.end();
});
