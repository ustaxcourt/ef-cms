#!/usr/bin/env -S npx ts-node --transpile-only

import { login, registerUser } from './irs-super-user.helpers';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
registerUser().then(() => login());
