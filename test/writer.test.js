'use strict';

const getStream = require('./helpers/get-stream');
const Writer = require('../');
const prettier = require('prettier');

const clean = body => prettier.format(JSON.stringify(body, null, 2));

test('writer produces a feed of dependencies with ids hashed', async () => {
    expect.hasAssertions();
    const writer = new Writer('./test/mock/main.js');
    const result = await getStream(writer.bundle());

    expect(clean(result)).toMatchSnapshot();
});

test('options object passes options on to browserify', async () => {
    expect.hasAssertions();
    const writer = new Writer(['./test/mock/main.js'], {
        debug: true,
    });
    const result = await getStream(writer.bundle());

    expect(clean(result)).toMatchSnapshot();
});

test('bundle option allows getting a bundle instead of a feed', async () => {
    expect.hasAssertions();
    const writer = new Writer('./test/mock/main.js', {}, true);
    const result = await getStream(writer.bundle());

    expect(result).toMatchSnapshot();
});

test('module throws if `files` argument is not an array', async () => {
    expect.hasAssertions();
    const run = () => new Writer(null, {}, true);
    expect(run).toThrowErrorMatchingSnapshot();
});

test('feed is not deduped', async () => {
    expect.hasAssertions();
    const writer = new Writer('./test/mock/no-dedupe.js', {});
    const result = await getStream(writer.bundle());

    expect(clean(result)).toMatchSnapshot();
});

test('different modules with identical source code do produce same id hash.', async () => {
    expect.hasAssertions();
    const writer = new Writer('./test/mock/identical-implementation');
    const feed = await getStream(writer.bundle());

    let identicalHashes = false;
    const hashes = new Map();
    for (const feedItem of feed) {
        if (hashes.has(feedItem.id)) {
            identicalHashes = true;
            break;
        }
        hashes.set(feedItem.id, true);
    }
    expect(identicalHashes).toBe(false);
});
