#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';

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
  const dynamoClient = new DynamoDBClient({
    region: 'us-east-1',
  });
  const documentClient = DynamoDBDocument.from(dynamoClient, {
    marshallOptions: { removeUndefinedValues: true },
  });
  const currentColorRecord = await documentClient.get({
    Key: { pk: 'current-color', sk: 'current-color' },
    TableName: `efcms-deploy-${env}`,
  });
  const activeColor: 'blue' | 'green' | undefined =
    currentColorRecord?.Item?.current;

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
