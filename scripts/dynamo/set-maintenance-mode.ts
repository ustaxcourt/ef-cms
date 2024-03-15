import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

// # Usage
// #   npx ts-node set-maintenance-mode.ts true dev

// # Arguments
// #   - $1 - true to engage maintenance mode, false to disengage maintenance mode

const args = process.argv.slice(2);
const enableMaintenanceMode: boolean = args[0] === 'true';

const { ENV } = process.env;

if (typeof enableMaintenanceMode !== 'boolean') {
  throw new Error('A value for enable maintenance mode is required.');
}
if (typeof ENV !== 'string') {
  throw new Error('A value for env is required.');
}

async function setMaintenanceMode() {
  const dynamoClient = new DynamoDBClient({
    region: 'us-east-1',
  });
  const documentClient = DynamoDBDocument.from(dynamoClient, {
    marshallOptions: { removeUndefinedValues: true },
  });
  const currentColorRecord = await documentClient.get({
    Key: { pk: 'current-color', sk: 'current-color' },
    TableName: `efcms-deploy-${ENV}`,
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
  const westClient = new LambdaClient({
    region: 'us-west-1',
  });

  console.log(
    `Setting Maintenance mode to ${enableMaintenanceMode} for ${ENV}`,
  );

  const command = new InvokeCommand({
    FunctionName: `send_maintenance_notifications_${ENV}_${activeColor}`,
    InvocationType: 'RequestResponse',
    Payload: Buffer.from(
      JSON.stringify({
        maintenanceMode: enableMaintenanceMode,
      }),
    ),
  });

  await Promise.all([eastClient.send(command), westClient.send(command)]);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
setMaintenanceMode();
