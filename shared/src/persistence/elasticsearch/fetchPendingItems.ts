import { search } from './searchClient';

export const fetchPendingItems = async ({
  applicationContext,
  judge,
  page,
  unservableEventCodes,
}) => {
  const caseSource = [
    'associatedJudge',
    'caseCaption',
    'docketNumber',
    'docketNumberSuffix',
    'status',
  ];
  const docketEntrySource = [
    'docketEntryId',
    'documentType',
    'documentTitle',
    'receivedAt',
  ];

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
            { term: { 'entityName.S': 'DocketEntry' } },
            { term: { 'pending.BOOL': true } },
            hasParentParam,
            {
              bool: {
                should: [
                  {
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
                  },
                  { terms: { 'eventCode.S': unservableEventCodes } },
                ],
              },
            },
          ],
        },
      },
      size,
      sort: [
        {
          'receivedAt.S': {
            order: 'asc',
          },
        },
        {
          'docketEntryId.S': {
            order: 'asc',
          },
        },
      ],
    },
    index: 'efcms-docket-entry',
  };

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

  return { foundDocuments: results, total };
};
