'use strict';

const getStream = require('./helpers/get-stream');
const Writer = require('../');
const prettier = require('prettier');

const clean = body =>
    prettier.format(
        JSON.stringify(body, null, 2).replace(
            /"file":\s".*\/asset-pipe\//g,
            '"file": "'
        )
    );

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
