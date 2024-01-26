import { GET_PARENT_CASE } from '../helpers/searchClauses';
import { search } from '../searchClient';

export const getSectionInboxMessages = async ({
  applicationContext,
  section,
}) => {
  applicationContext.logger.info('getSectionInboxMessages start');
  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              term: { 'toSection.S': section },
            },
            {
              term: { 'isRepliedTo.BOOL': false },
            },
            {
              match: { 'isCompleted.BOOL': false },
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

  applicationContext.logger.info('getSectionInboxMessages end');

  return results;
};
