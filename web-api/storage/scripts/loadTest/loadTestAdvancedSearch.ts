#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../../../../scripts/helpers/parseArgsAndEnvVars';
import axios from 'axios';
import { existsSync, readFileSync } from 'fs';
import PQueue from 'p-queue';

const scriptConfig: ScriptConfig = {
  description:
    'loadTestAdvancedSearch - Performs load tests against OpenSearch',
  environment: {
    deployingColor: 'DEPLOYING_COLOR',
    efcmsDomain: 'EFCMS_DOMAIN',
  },
  parameters: {
    searchesFile: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
};
const { deployingColor, efcmsDomain, searchesFile } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  [k: string]: string;
};
const apiUrl = `https://public-api-${deployingColor}.${efcmsDomain}`;
const concurrency = 100;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  if (!existsSync(searchesFile)) {
    console.error('No searches file found.');
    process.exit(1);
  }
  const searches: string[] = readFileSync(searchesFile, 'utf8').split('\n');
  const queue = new PQueue({ concurrency });
  const funcs = searches.map(
    (search: string) => async () => await axios.get(`${apiUrl}${search}`),
  );
  await queue.addAll(funcs);
})();
