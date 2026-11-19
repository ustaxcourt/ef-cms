#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import {
  describeFailure,
  runWeeklySummary,
} from './security-weekly-summary-run.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'security-weekly-summary - Post the Monday security summary to Teams. Reads GITHUB_REPOSITORY, SINCE, RUN_URL and TEAMS_WEBHOOK_URL from the environment.',
  parameters: {
    dryRun: {
      description:
        'Print the Teams payload instead of posting it (refused in GitHub Actions)',
      long: 'dry-run',
      type: 'boolean',
    },
  },
};
const dryRun = parseArgsAndEnvVars(scriptConfig).dryRun === true;

runWeeklySummary({
  dryRun,
  env: process.env,
  now: createISODateString(),
}).catch((error: unknown) => {
  console.error(
    describeFailure({
      error,
      inGitHubActions: process.env.GITHUB_ACTIONS === 'true',
    }),
  );
  process.exitCode = 1;
});
