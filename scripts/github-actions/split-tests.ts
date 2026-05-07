#!/usr/bin/env -S npx ts-node --transpile-only

import { splitTests } from './split-tests.helpers';

const testType: string = process.argv.slice(2)[0] || '';

splitTests(testType);
