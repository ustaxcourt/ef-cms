import { update } from '../../dynamodbClientService';

export const updateAttributeOnDynamoRecord = ({
  applicationContext,
  attributeKey,
  attributeValue,
  pk,
  sk,
}: {
  applicationContext: IApplicationContext;
  pk: string;
  sk: string;
  attributeKey: string;
  attributeValue: string;
}) =>
  update({
    ExpressionAttributeNames: {
      [`#${attributeKey}`]: `${attributeKey}`,
    },
    ExpressionAttributeValues: {
      [`:${attributeKey}`]: attributeValue,
    },
    Key: {
      pk,
      sk,
    },
    UpdateExpression: `SET #${attributeKey} = :${attributeKey}`,
    applicationContext,
  });
