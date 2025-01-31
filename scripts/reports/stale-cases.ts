#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { applicationContext } from '@web-api/applicationContext';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { generateStaleCasesReport } from './stale-cases.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'stale-cases - Generates a spreadsheet of open cases that have not had ' +
    'a document filed within the last year',
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    environmentName: 'ENV',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const today = createISODateString().split('T')[0];
const OUTPUT_DIR = `${process.env.HOME}/Documents`;
const OUTPUT_FILENAME = `${OUTPUT_DIR}/12-month-inactivity_${today}.csv`;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await generateStaleCasesReport({
    applicationContext,
    filename: OUTPUT_FILENAME,
  });
})();
