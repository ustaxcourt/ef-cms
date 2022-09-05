const { GET_PARENT_CASE } = require('../helpers/searchClauses');
const { search } = require('../searchClient');

exports.getDocumentQCInboxForSection = async ({
  applicationContext,
  judgeUserName,
  section,
}) => {
  const query = {
    body: {
      query: {
        bool: {
          must: [
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
          ],
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
    query.body.query.bool.must.push({
      match: {
        'associatedJudge.S': `${judgeUserName}`,
      },
    });
  }

  const { results } = await search({
    applicationContext,
    searchParameters: query,
  });

  return results;
};
