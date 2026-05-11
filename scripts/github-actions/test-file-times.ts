#!/usr/bin/env -S npx ts-node --transpile-only

import { testFileTimes } from './test-file-times.helpers';

// not using parseArgsAndEnvVars here because the first arg dictates what to
// do with the rest of the args. parseArgsAndEnvVars does not support that,
// but there is full test coverage of all arg variations in the helper
const args = process.argv.slice(2);

testFileTimes(args);
