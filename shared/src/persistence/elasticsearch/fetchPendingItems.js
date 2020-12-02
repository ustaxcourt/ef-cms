const { isCodeEnabled } = require('../../../../codeToggles');
const { search } = require('./searchClient');

exports.fetchPendingItems = async ({
  applicationContext,
  judge,
  page,
  source,
}) => {
  const caseSource = isCodeEnabled(7134)
    ? [
        'associatedJudge',
        'caseCaption',
        'docketNumber',
        'docketNumberSuffix',
        'status',
      ]
    : source;
  const docketEntrySource = isCodeEnabled(7134)
    ? ['docketEntryId', 'documentType', 'documentTitle', 'receivedAt']
    : source;

  const { PENDING_ITEMS_PAGE_SIZE } = applicationContext.getConstants();

  const size = page ? PENDING_ITEMS_PAGE_SIZE : 5000;

  const from = page ? page * size : undefined;

  const hasParentParam = {
    has_parent: {
      inner_hits: {
        _source: {
          includes: caseSource,
        },
        name: 'case-mappings',
      },
      parent_type: 'case',
      query: { match_all: {} },
    },
  };

  const searchParameters = {
    body: {
      _source: docketEntrySource,
      from,
      query: {
        bool: {
          must: [
            { match: { 'pk.S': 'case|' } },
            { match: { 'sk.S': 'docket-entry|' } },
            { term: { 'pending.BOOL': true } },
            hasParentParam,
          ],
        },
      },
      size,
    },
    index: 'efcms-docket-entry',
  };

  if (isCodeEnabled(7198)) {
    const matchingOnServedAtOrLegacyServed = {
      bool: {
        minimum_should_match: 1,
        should: [
          {
            exists: {
              field: 'servedAt',
            },
          },
          { term: { 'isLegacyServed.BOOL': true } },
        ],
      },
    };

    searchParameters.body.query.bool.must.push(
      matchingOnServedAtOrLegacyServed,
    );
  } else {
    const matchingOnServedAt = {
      exists: {
        field: 'servedAt',
      },
    };

    searchParameters.body.query.bool.must.push(matchingOnServedAt);
  }

  if (judge) {
    hasParentParam.has_parent.query = {
      bool: {
        must: [
          {
            match_phrase: { 'associatedJudge.S': judge },
          },
        ],
      },
    };
  }

  const { results, total } = await search({
    applicationContext,
    searchParameters,
  });

  let result = { results, total };

  if (isCodeEnabled(7134)) {
    result = { foundDocuments: results, total };
  }

  return result;
};
