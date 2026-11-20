#!/usr/bin/env -S npx ts-node --transpile-only

import { runCli } from './run-jest-file-with-coverage.helpers';

process.exitCode = runCli({ args: process.argv.slice(2) });
