import { Search_Request } from '@opensearch-project/opensearch/api';
import { GET_PARENT_CASE } from '../helpers/searchClauses';
import { search } from '../searchClient';
import { QueryContainer } from '@opensearch-project/opensearch/api/_types/_common.query_dsl';

export const getDocumentQCInboxForSection = async ({
  applicationContext,
  judgeUserName,
  section,
}) => {
  applicationContext.logger.info('getDocumentQCInboxForSection start');
  const must: QueryContainer[] = [
    {
      prefix: { 'pk.S': 'case|' },
    },
    {
      prefix: { 'sk.S': 'work-item|' },
    },
    {
      term: {
        'section.S': section,
      },
    },
  ];
  const query: Search_Request = {
    body: {
      query: {
        bool: {
          must,
          must_not: {
            exists: {
              field: 'completedAt.S',
            },
          },
          should: [
            {
              term: {
                'highPriority.BOOL': {
                  boost: 500,
                  value: true,
                },
              },
            },
            GET_PARENT_CASE,
          ],
        },
      },
      size: 5000,
    },
    index: 'efcms-work-item',
  };

  if (judgeUserName) {
    must.push({
      match: {
        'associatedJudge.S': `${judgeUserName}`,
      },
    });
  }

  const { results } = await search({
    applicationContext,
    searchParameters: query,
  });

  applicationContext.logger.info('getDocumentQCInboxForSection end');

  return results;
};
