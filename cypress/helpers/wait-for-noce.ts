import { getDocumentClient } from './dynamo/getDynamoCypress';

export async function waitForNoce({
  attempts = 0,
  docketNumber,
}: {
  docketNumber: string;
  attempts?: number;
}): Promise<boolean> {
  const maxAttempts = 10;
  const result = await getDocumentClient().query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${docketNumber}`,
      ':prefix': 'docket-entry',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    TableName: process.env.DYNAMODB_TABLE_NAME,
  });

  const noce = result.Items?.find(item => item.eventCode === 'NOCE');

  if (noce) {
    return true;
  }

  if (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    return waitForNoce({ attempts: attempts + 1, docketNumber });
  } else {
    return false;
  }
}
