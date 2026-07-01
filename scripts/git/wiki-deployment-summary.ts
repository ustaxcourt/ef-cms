#!/usr/bin/env -S npx ts-node --transpile-only

import { GhCliGitHubClient } from './github-client';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { generateWikiSummary } from './wiki-deployment-summary.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'Generate a contributor-focused deployment summary for the project wiki',
  parameters: {
    pullRequestNumber: {
      position: 0,
      required: false,
      transform: 'number',
      type: 'string',
    },
  },
  requireActiveAwsSession: false,
};

const { pullRequestNumber } = parseArgsAndEnvVars(scriptConfig) as {
  pullRequestNumber?: number;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const githubClient = new GhCliGitHubClient();
  const summary = await generateWikiSummary(
    githubClient,
    pullRequestNumber && pullRequestNumber > 0 ? pullRequestNumber : undefined,
  );
  console.log(summary);
})();
