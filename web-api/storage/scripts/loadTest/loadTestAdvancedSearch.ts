#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../../../../scripts/helpers/parseArgsAndEnvVars';
import axios from 'axios';

const scriptConfig: ScriptConfig = {
  description:
    'loadTestAdvancedSearch - Performs load tests against OpenSearch',
  environment: {
    deployingColor: 'DEPLOYING_COLOR',
    efcmsDomain: 'EFCMS_DOMAIN',
  },
};
const { deployingColor, efcmsDomain } = parseArgsAndEnvVars(scriptConfig) as {
  [k: string]: string;
};
const apiUrl = `https://public-api-${deployingColor}.${efcmsDomain}/public-api`;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  for (let i = 0; i < 100; i++) {
    await axios.get(`${apiUrl}/search`);
  }
})();
