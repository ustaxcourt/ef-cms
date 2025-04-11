import { queryFull } from '../../dynamodbClientService';

export const getCasesForUser = ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}) =>
  queryFull({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `user|${userId}`,
      ':prefix': 'case',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

export const getDocketNumbersByUser = async ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}): Promise<string[]> => {
  const cases = await getCasesForUser({
    applicationContext,
    userId,
  });
  return cases.map(mapping => mapping.sk.split('|')[1]);
};
