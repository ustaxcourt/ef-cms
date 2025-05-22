import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

const FEATURE_FLAGS_WITH_CURRENT_PROPERTY = [
  'clerk-of-court-configuration',
  'section-outbox-number-of-days',
  'aws-batch-zipper-minimum-count',
  'chief-judge-name',
  'maintenance-mode',
  'entity-locking-feature-flag',
  'document-visibility-policy-change-date',
  'e-consent-fields-enabled-feature-flag',
  'use-change-of-address-lambda',
];

const { STAGE, ENV } = process.env;

async function script() {
  const DYNAMO_CLIENT = new DynamoDBClient({
    region: 'us-east-1',
  });

  const DOCUMENT_CLIENT = DynamoDBDocument.from(DYNAMO_CLIENT, {
    marshallOptions: { removeUndefinedValues: true },
  });

  const FEATURE_FLAG_RECORDS: { name: string; value: { current: any } }[] = [];

  for (const index in FEATURE_FLAGS_WITH_CURRENT_PROPERTY) {
    const FEATURE_FLAG = FEATURE_FLAGS_WITH_CURRENT_PROPERTY[index];
    const DYNAMO_FEATURE_FLAG_RECORD = await DOCUMENT_CLIENT.get({
      Key: { pk: FEATURE_FLAG, sk: FEATURE_FLAG },
      TableName: `efcms-deploy-${STAGE || ENV}`,
    });

    if (!DYNAMO_FEATURE_FLAG_RECORD || !DYNAMO_FEATURE_FLAG_RECORD.Item) {
      continue;
    }

    const FEATURE_FLAG_RECORD = {
      name: FEATURE_FLAG,
      value: { current: DYNAMO_FEATURE_FLAG_RECORD.Item?.current },
    };

    FEATURE_FLAG_RECORDS.push(FEATURE_FLAG_RECORD);
  }

  const DYNAMO_ALLOWED_TERMINAL_IPS_RECORD = await DOCUMENT_CLIENT.get({
    Key: { pk: 'allowed-terminal-ips', sk: 'allowed-terminal-ips' },
    TableName: `efcms-deploy-${STAGE || ENV}`,
  });

  if (
    DYNAMO_ALLOWED_TERMINAL_IPS_RECORD &&
    DYNAMO_ALLOWED_TERMINAL_IPS_RECORD.Item
  ) {
    const FEATURE_FLAG_ALLOWED_TERMINAL_IPS_RECORD = {
      name: 'allowed-terminal-ips',
      value: { current: DYNAMO_ALLOWED_TERMINAL_IPS_RECORD.Item?.current },
    };

    FEATURE_FLAG_RECORDS.push(FEATURE_FLAG_ALLOWED_TERMINAL_IPS_RECORD);
  }

  await pgInsertInto({
    table: 'dwFeatureFlag',
    values: FEATURE_FLAG_RECORDS,
    onConflictColumns: ['name'],
  });
}

void script();
