#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { runCompareSecurityFindingsScript } from './compare-security-findings.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'compare-security-findings - Fail when this branch has SARIF findings that staging does not',
  parameters: {
    specs: {
      commaDelimited: true,
      description:
        'One or more <tool>:<branch.sarif>:<staging.sarif> comparisons, separated by commas',
      position: 0,
      required: true,
      type: 'string',
    },
  },
};
const { specs } = parseArgsAndEnvVars(scriptConfig) as { specs: string[] };

process.exitCode = runCompareSecurityFindingsScript({
  specs,
  stepSummaryPath: process.env.GITHUB_STEP_SUMMARY,
});
