'use strict';

const entries = require('object.entries');
const values = require('object.values');

const obj = { one: 1, two: 2, three: 3 };

console.log(entries(obj));
console.log(values(obj));
