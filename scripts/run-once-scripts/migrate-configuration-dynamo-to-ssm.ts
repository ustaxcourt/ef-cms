import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const configurations = [
  'migration-queue-empty',
  'destination-table-version',
  'maintenance-mode',
  'current-color',
  'migrate',
];

const { STAGE } = process.env;

async function script() {
  const DYNAMO_CLIENT = new DynamoDBClient({
    region: 'us-east-1',
  });

  const DOCUMENT_CLIENT = DynamoDBDocument.from(DYNAMO_CLIENT, {
    marshallOptions: { removeUndefinedValues: true },
  });

  const SSM_CLIENT = new SSMClient({ region: 'us-east-1' });

  for (const index in configurations) {
    const config = configurations[index];
    const configRecord = await DOCUMENT_CLIENT.get({
      Key: { pk: config, sk: config },
      TableName: `efcms-deploy-${STAGE}`,
    });

    const CURRENT_VALUE = configRecord?.Item?.current;
    if (!CURRENT_VALUE && typeof CURRENT_VALUE !== 'boolean') {
      console.log('Could not find value for ->', config);
      continue;
    }
    const SSM_COMMAND = new PutParameterCommand({
      Name: `/DAWSON/${STAGE}/${config}`,
      Value: CURRENT_VALUE.toString(),
      Type: 'String',
      Overwrite: true,
    });
    await SSM_CLIENT.send(SSM_COMMAND);
  }
}

void script();
