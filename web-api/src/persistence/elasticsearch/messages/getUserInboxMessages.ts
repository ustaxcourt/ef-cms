import { GET_PARENT_CASE } from '../helpers/searchClauses';
import { queryFull } from '../../dynamodbClientService';
import { search } from '../searchClient';

export const getUserInboxMessages = async ({ applicationContext, userId }) => {
  applicationContext.logger.info('getUserInboxMessages start');

  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              term: { 'toUserId.S': userId },
            },
            {
              term: { 'isRepliedTo.BOOL': false },
            },
            {
              term: { 'isCompleted.BOOL': false },
            },
            GET_PARENT_CASE,
          ],
        },
      },
      size: 5000,
    },
    index: 'efcms-message',
  };

  const { results } = await search({
    applicationContext,
    searchParameters: query,
  });

  applicationContext.logger.info('getUserInboxMessages end');

  return results;
};

export const getUserInboxMessageCount = async ({
  applicationContext,
  userId,
}: {
  applicationContext: IApplicationContext;
  userId: string;
}): Promise<number> => {
  const result = (await queryFull({
    ExpressionAttributeNames: {
      '#gsi2pk': 'gsi2pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':gsi2pk': `assigneeId|${userId}`,
      ':prefix': 'message',
    },
    IndexName: 'gsi2',
    KeyConditionExpression: '#gsi2pk = :gsi2pk and begins_with(#sk, :prefix)',
    applicationContext,
  })) as any;

  return result.Count;
};
