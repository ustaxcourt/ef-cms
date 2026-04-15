#!/usr/bin/env -S npx ts-node --transpile-only

import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getSSMItem } from 'shared/admin-tools/aws/ssmHelper';

const scriptConfig: ScriptConfig = {
  description: 'set-read-only-mode - Toggles Read Only Mode UI notification',
  environment: { env: 'ENV' },
  parameters: {
    toggle: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { env, toggle } = parseArgsAndEnvVars(scriptConfig) as {
  env: string;
  toggle: string;
};
const enableReadOnlyMode: boolean = toggle === 'true';

async function setReadOnlyMode() {
  const activeColor = await getSSMItem('current-color');

  if (!activeColor) {
    throw new Error('Could not determine the active color');
  }

  console.log(`Active color detected as ${activeColor}`);

  const eastClient = new LambdaClient({
    region: 'us-east-1',
  });

  console.log(
    `Setting Read Only notification mode to ${enableReadOnlyMode} for ${env}`,
  );

  const command = new InvokeCommand({
    FunctionName: `send_read_only_notifications_${env}_${activeColor}`,
    InvocationType: 'RequestResponse',
    Payload: Buffer.from(
      JSON.stringify({
        readOnlyMode: enableReadOnlyMode,
      }),
    ),
  });

  await eastClient.send(command);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
setReadOnlyMode();
