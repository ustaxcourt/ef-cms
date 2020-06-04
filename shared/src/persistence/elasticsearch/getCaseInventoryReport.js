const { search } = require('./searchClient');

/**
 * getCaseInventoryReport
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.associatedJudge the optional judge filter
 * @param {number} providers.from the item index to start from
 * @param {number} providers.pageSize the number of items to retrieve
 * @param {string} providers.status the optional status filter
 * @returns {object} the items found and the total count
 */
exports.getCaseInventoryReport = async ({
  applicationContext,
  associatedJudge,
  from = 0,
  pageSize,
  status,
}) => {
  const source = [
    'associatedJudge',
    'caseCaption',
    'docketNumber',
    'docketNumberSuffix',
    'docketNumberWithSuffix',
    'status',
  ];
  const { CASE_INVENTORY_MAX_PAGE_SIZE } = applicationContext.getConstants();
  const size =
    pageSize && pageSize <= CASE_INVENTORY_MAX_PAGE_SIZE
      ? pageSize
      : CASE_INVENTORY_MAX_PAGE_SIZE;

  const searchParameters = {
    body: {
      _source: source,
      from,
      query: {
        bool: {
          must: [
            {
              match: { 'entityName.S': 'Case' },
            },
            { match: { 'pk.S': 'case|' } },
            { match: { 'sk.S': 'case|' } },
          ],
        },
      },
      size,
      sort: [{ 'sortableDocketNumber.N.keyword': { order: 'asc' } }],
    },
    index: 'efcms-case',
  };

  if (associatedJudge) {
    searchParameters.body.query.bool.must.push({
      match_phrase: { 'associatedJudge.S': associatedJudge },
    });
  }

  if (status) {
    searchParameters.body.query.bool.must.push({
      match_phrase: { 'status.S': status },
    });
  }

  const { results, total } = await search({
    applicationContext,
    searchParameters,
  });

  return {
    foundCases: results,
    totalCount: total,
  };
};
