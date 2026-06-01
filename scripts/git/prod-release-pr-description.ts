#!/usr/bin/env -S npx ts-node --transpile-only
/* istanbul ignore file */

import { prodReleasePrDescription } from './prod-release-pr-description.helpers';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
prodReleasePrDescription();
