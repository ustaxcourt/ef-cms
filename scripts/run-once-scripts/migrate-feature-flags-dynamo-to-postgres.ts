import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { getDbWriter } from '@web-api/database';

const FEATURE_FLAGS_WITH_CURRENT_PROPERTY = [
  'aws-batch-zipper-minimum-count',
  'chief-judge-name',
  'entity-locking-feature-flag',
  'document-visibility-policy-change-date',
  'e-consent-fields-enabled-feature-flag',
  'use-change-of-address-lambda',
];

const { STAGE } = process.env;

async function script() {
  const DYNAMO_CLIENT = new DynamoDBClient({
    region: 'us-east-1',
  });

  const DOCUMENT_CLIENT = DynamoDBDocument.from(DYNAMO_CLIENT, {
    marshallOptions: { removeUndefinedValues: true },
  });

  for (const index in FEATURE_FLAGS_WITH_CURRENT_PROPERTY) {
    const FEATURE_FLAG = FEATURE_FLAGS_WITH_CURRENT_PROPERTY[index];
    const FEATURE_FLAG_RECORD = await DOCUMENT_CLIENT.get({
      Key: { pk: FEATURE_FLAG, sk: FEATURE_FLAG },
      TableName: `efcms-deploy-${STAGE}`,
    });

    if (!FEATURE_FLAG_RECORD || !FEATURE_FLAG_RECORD.Item) {
      continue;
    }

    const featureFlagRecord = {
      name: FEATURE_FLAG,
      value: { current: FEATURE_FLAG_RECORD.Item?.current },
    };

    await getDbWriter(writer =>
      writer
        .insertInto('dwFeatureFlag')
        .values(featureFlagRecord)
        .onConflict(oc =>
          oc.column('name').doUpdateSet({
            value: featureFlagRecord.value,
          }),
        )
        .execute(),
    );
  }
}

void script();
