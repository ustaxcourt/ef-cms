#!/usr/bin/env -S npx ts-node --transpile-only

import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getSSMItem } from 'shared/admin-tools/aws/ssmHelper';

//TODO - TEST AGAINST EXP3
const scriptConfig: ScriptConfig = {
  description: 'set-maintenance-mode - Toggles Maintenance Mode',
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
const enableMaintenanceMode: boolean = toggle === 'true';

async function setMaintenanceMode() {
  const activeColor = await getSSMItem('current-color');

  if (!activeColor) {
    throw new Error('Could not determine the active color');
  }

  console.log(`Active color detected as ${activeColor}`);

  const eastClient = new LambdaClient({
    region: 'us-east-1',
  });

  console.log(
    `Setting Maintenance mode to ${enableMaintenanceMode} for ${env}`,
  );

  const command = new InvokeCommand({
    FunctionName: `send_maintenance_notifications_${env}_${activeColor}`,
    InvocationType: 'RequestResponse',
    Payload: Buffer.from(
      JSON.stringify({
        maintenanceMode: enableMaintenanceMode,
      }),
    ),
  });

  await eastClient.send(command);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
setMaintenanceMode();
