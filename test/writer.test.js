'use strict';

const JSONStream = require('JSONStream');
const Writer = require('../');

test('foo() - bar', () => {
    const writer = new Writer('./test/mock/main.js', {}, false, false);
    writer
        .bundle()
        .pipe(JSONStream.stringify())
        .pipe(process.stdout);

    expect(true).toBe(true);
});
