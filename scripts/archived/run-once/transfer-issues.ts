#!/usr/bin/env -S npx ts-node --transpile-only

// prerequisite: clone the labels like so -
//   gh label clone ustaxcourt/ef-cms-flexion --force

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../../helpers/parseArgsAndEnvVars';
import { runCommand } from '../../helpers/runCommand';
import { sleep } from '@shared/tools/helpers';

const scriptConfig: ScriptConfig = {
  description:
    'transfer-issues - Transfers issues from ef-cms-flexion to ef-cms',
  parameters: {
    batchSize: {
      default: '100',
      long: 'batch-size',
      required: false,
      short: 'b',
      transform: 'number',
      type: 'string',
    },
    waitMillis: {
      default: '50',
      long: 'wait-millis',
      required: false,
      short: 'w',
      transform: 'number',
      type: 'string',
    },
  },
};

const { batchSize, waitMillis } = parseArgsAndEnvVars(scriptConfig) as {
  [key: string]: number;
};

const transferIssues = async () => {
  const issuesJson: { number: number }[] = JSON.parse(
    await runCommand('gh', [
      'issue',
      'list',
      '--json',
      'number',
      '--limit',
      `${batchSize}`,
      '--search',
      'sort:created-asc',
      '--state',
      'all',
      '--repo',
      'ustaxcourt/ef-cms-flexion',
    ]),
  );
  const issuesSet = new Set(issuesJson.map(issue => issue.number));

  for (const issue of [...issuesSet]) {
    console.log(`Transferring issue ${issue}...`);
    await runCommand(
      'gh',
      [
        'issue',
        'transfer',
        `https://github.com/ustaxcourt/ef-cms-flexion/issues/${issue}`,
        'ustaxcourt/ef-cms',
      ],
      undefined,
      { captureStdout: false, streamStdout: true },
    );
    await sleep(waitMillis);
  }
};

async function app() {
  await transferIssues();
}

void app();
