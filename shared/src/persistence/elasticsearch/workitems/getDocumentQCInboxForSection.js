const { search } = require('../searchClient');

exports.getDocumentQCInboxForSection = async ({
  applicationContext,
  judgeUserName,
  section,
}) => {
  const hasParentParam = {
    has_parent: {
      inner_hits: {
        _source: {
          includes: ['leadDocketNmber', 'docketNumber'],
        },
        name: 'case-mappings',
      },
      parent_type: 'case',
      query: { match_all: {} },
    },
  };
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
            hasParentParam,
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

  // console.log('########Section Inbox##########', results); // case_relations undefined

  return results;
};
