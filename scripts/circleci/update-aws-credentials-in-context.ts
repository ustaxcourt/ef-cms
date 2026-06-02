#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { updateAwsCredentialsInContext } from './update-aws-credentials-in-context.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'update-aws-credentials-in-context - Update AWS credentials in a specific CircleCI context',
  environment: {
    apiToken: 'CIRCLE_MACHINE_USER_TOKEN',
    projectSlug: 'CIRCLE_PROJECT_SLUG',
  },
  parameters: {
    awsAccessKeyId: {
      required: true,
      type: 'string',
    },
    awsSecretAccessKey: {
      required: true,
      type: 'string',
    },
    contextName: {
      required: true,
      type: 'string',
    },
  },
};

const {
  apiToken,
  awsAccessKeyId,
  awsSecretAccessKey,
  contextName,
  projectSlug,
} = parseArgsAndEnvVars(scriptConfig) as {
  apiToken: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  contextName: string;
  projectSlug: string;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await updateAwsCredentialsInContext({
    apiToken,
    awsAccessKeyId,
    awsSecretAccessKey,
    contextName,
    projectSlug,
  });
})();
