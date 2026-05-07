#!/usr/bin/env -S npx ts-node --transpile-only

import { testFileTimes } from './test-file-times.helpers';

const args = process.argv.slice(2);

testFileTimes(args);
