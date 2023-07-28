import { query } from '../../dynamodbClientService';

export const verifyCaseForUser = async ({
  applicationContext,
  docketNumber,
  userId,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  userId: string;
}) => {
  const myCase = await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `user|${userId}`,
      ':sk': `case|${docketNumber}`,
    },
    KeyConditionExpression: '#pk = :pk AND #sk = :sk',
    applicationContext,
  });

  return myCase && myCase.length > 0;
};
