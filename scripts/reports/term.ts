#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { termReport } from './term.helpers';

const scriptConfig: ScriptConfig = {
  description: 'term - Generates one CSV per location for a calendar term.',
  environment: {
    env: 'ENV',
    home: 'HOME',
  },
  parameters: {
    term: {
      description: 'Term name: Winter, Spring, or Fall',
      position: 0,
      required: true,
      transform: 'toLowerCase',
      type: 'string',
    },
    year: {
      position: 1,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};

const { home, term, year } = parseArgsAndEnvVars(scriptConfig) as {
  home: string;
  term: string;
  year: string;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await termReport({
    outputDir: `${home}/Documents`,
    term,
    termYear: year,
  });
})();
