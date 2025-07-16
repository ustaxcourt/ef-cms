import { marshall } from '@aws-sdk/util-dynamodb';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { aggregateCaseItems } from '@web-api/persistence/dynamo/helpers/aggregateCaseItems';
import { get, query } from '@web-api/persistence/dynamodbClientService';

// TODO: Delete after 10502 is finished
export const getCaseDataFromDynamo = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: ServerApplicationContext;
  docketNumber: string;
}) => {
  const caseItems = [
    await get({
      Key: {
        pk: `case|${docketNumber}`,
        sk: `case|${docketNumber}`,
      },
      applicationContext,
    }),

    ...(await query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${docketNumber}`,
        ':prefix': 'privatePractitioner',
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      applicationContext,
    })),

    ...(await query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${docketNumber}`,
        ':prefix': 'irsPractitioner',
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      applicationContext,
    })),
  ];

  const unmarshalledCase = aggregateCaseItems(caseItems);
  return marshall(unmarshalledCase);
};
