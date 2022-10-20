import { queryFull } from '../../dynamodbClientService';

export const getDocketNumbersByUser = async ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}) => {
  const cases = await getCasesAssociatedWithUser({
    applicationContext,
    userId,
  });
  return cases.map(mapping => mapping.sk.split('|')[1]);
};

export const getCasesAssociatedWithUser = ({
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
