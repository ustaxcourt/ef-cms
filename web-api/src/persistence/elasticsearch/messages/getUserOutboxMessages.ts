import { GET_PARENT_CASE } from '../helpers/searchClauses';
import { calculateISODate } from '../../../../../shared/src/business/utilities/DateHandler';
import { search } from '../searchClient';

export const getUserOutboxMessages = async ({ applicationContext, userId }) => {
  const filterDate = calculateISODate({ howMuch: -7 });

  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              term: { 'fromUserId.S': userId },
            },
            {
              range: {
                'createdAt.S': {
                  format: 'strict_date_time', // ISO-8601 time stamp
                  gte: filterDate,
                },
              },
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

  return results;
};
