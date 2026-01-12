import { Search_Request } from '@opensearch-project/opensearch/api';
import { efcmsCaseIndex } from '../../../elasticsearch/efcms-case-mappings';
import { efcmsDocketEntryIndex } from '../../../elasticsearch/efcms-docket-entry-mappings';

export const emptyResults = {
  body: {
    _shards: {
      failed: 0,
      skipped: 0,
      successful: 1,
      total: 1,
    },
    hits: {
      hits: [],
      max_score: null,
      total: {
        relation: 'eq',
        value: 0,
      },
    },
    timed_out: false,
    took: 66,
  },
};

export const mockCaseSearchResult = {
  body: {
    _shards: {
      failed: 0,
      skipped: 0,
      successful: 1,
      total: 1,
    },
    hits: {
      hits: [
        {
          _id: 'case|101-23_case|101-23',
          _index: efcmsCaseIndex,
          _score: null,
          _source: {
            associatedJudge: { S: 'Buch' },
            caseCaption: { S: 'Justin Jefferson, Petitioner' },
            caseType: { S: 'Whistleblower' },
            docketNumber: { S: '101-23' },
            isPaper: { BOOL: false },
            preferredTrialCity: { S: 'Birmingham, Alabama' },
            procedureType: { S: 'Regular' },
            receivedAt: { S: '2023-03-13T22:23:32.843Z' },
            status: { S: 'New' },
          },
          _type: '_doc',
          sort: [1678746212843, 'case|101-23'],
        },
      ],
      max_score: 1,
      total: {
        relation: 'eq',
        value: 1,
      },
    },
    timed_out: false,
    took: 66,
  },
};

export const mockDocketEntrySearchResult = {
  body: {
    _shards: {
      failed: 0,
      skipped: 0,
      successful: 1,
      total: 1,
    },
    aggregations: {
      closed_cases: {
        buckets: [],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
    },
    hits: {
      hits: [
        {
          _id: 'case|312-21_docket-entry|b8ab6e48-4eb8-43af-9776-106979baff5e',
          _index: efcmsDocketEntryIndex,
          _routing: 'case|312-21_case|312-21|mapping',
          _score: null,
          _source: {
            addToCoversheet: {
              BOOL: false,
            },
            case_relations: {
              name: 'document',
              parent: 'case|312-21_case|312-21|mapping',
            },
            createdAt: {
              S: '2021-01-01T05:45:21.944Z',
            },
            docketEntryId: {
              S: 'b8ab6e48-4eb8-43af-9776-106979baff5e',
            },
            docketNumber: {
              S: '312-21',
            },
            documentTitle: {
              S: 'Petition',
            },
            documentType: {
              S: 'Petition',
            },
            entityName: {
              S: 'DocketEntry',
            },
            eventCode: {
              S: 'P',
            },
            filedBy: {
              S: 'Petr. Eve Brewer',
            },
            filedByRole: {
              S: 'petitioner',
            },
            filers: {
              L: [
                {
                  S: '7805d1ab-18d0-43ec-bafb-654e83405416',
                },
              ],
            },
            filingDate: {
              S: '2021-01-01T05:45:21.942Z',
            },
            index: {
              N: '1',
            },
            isDraft: {
              BOOL: false,
            },
            isFileAttached: {
              BOOL: true,
            },
            isMinuteEntry: {
              BOOL: false,
            },
            isOnDocketRecord: {
              BOOL: true,
            },
            isStricken: {
              BOOL: false,
            },
            numberOfPages: {
              N: '4',
            },
            pending: {
              BOOL: false,
            },
            pk: {
              S: 'case|312-21',
            },
            privatePractitioners: {
              L: [],
            },
            processingStatus: {
              S: 'complete',
            },
            receivedAt: {
              S: '2021-01-01T05:00:00.000Z',
            },
            servedAt: {
              S: '2021-01-03T12:31:22.259Z',
            },
            servedParties: {
              L: [
                {
                  M: {
                    name: {
                      S: 'IRS',
                    },
                    role: {
                      S: 'irsSuperuser',
                    },
                  },
                },
              ],
            },
            servedPartiesCode: {
              S: 'R',
            },
            sk: {
              S: 'docket-entry|b8ab6e48-4eb8-43af-9776-106979baff5e',
            },
            userId: {
              S: '7805d1ab-18d0-43ec-bafb-654e83405416',
            },
          },
          _type: '_doc',
          inner_hits: {
            'case-mappings': {
              hits: {
                hits: [
                  {
                    _id: 'case|312-21_case|312-21|mapping',
                    _index: efcmsDocketEntryIndex,
                    _score: 1,
                    _source: {
                      docketNumber: {
                        S: '312-21',
                      },
                    },
                    _type: '_doc',
                  },
                ],
                max_score: 1,
                total: {
                  relation: 'eq',
                  value: 1,
                },
              },
            },
          },
          sort: [1629483399420],
        },
      ],
      max_score: null,
      total: {
        relation: 'eq',
        value: 1,
      },
    },
    timed_out: false,
    took: 5,
  },
};

export const mockMalformedQueryResult = {
  error: {
    reason: 'query malformed, empty clause found at [5:3]',
    root_cause: [
      {
        reason: 'query malformed, empty clause found at [5:3]',
        type: 'illegal_argument_exception',
      },
    ],
    type: 'illegal_argument_exception',
  },
  status: 400,
};

export const mockNonexistentDocumentCountResult = {
  body: {
    _shards: {
      failed: 0,
      skipped: 0,
      successful: 1,
      total: 1,
    },
    hits: {
      hits: [],
      max_score: null,
      total: {
        relation: 'eq',
        value: 0,
      },
    },
    timed_out: false,
    took: 24,
  },
};

export const mockPractitionerRoleAggregationResult = {
  body: {
    _shards: {
      failed: 0,
      skipped: 0,
      successful: 1,
      total: 1,
    },
    aggregations: {
      roles: {
        buckets: [
          {
            doc_count: 763,
            key: 'privatePractitioner',
          },
          {
            doc_count: 18,
            key: 'irsPractitioner',
          },
        ],
        doc_count_error_upper_bound: 0,
        sum_other_doc_count: 0,
      },
    },
    hits: {
      hits: [],
      max_score: null,
      total: {
        relation: 'gte',
        value: 10000,
      },
    },
    timed_out: false,
    took: 23,
  },
};

export const openCasesReceivedOnJulyFourthSearchParameters: Search_Request = {
  body: {
    _source: ['docketNumber.S', 'receivedAt.S'],
    query: {
      bool: {
        must: [
          {
            range: {
              'receivedAt.S': {
                format: 'strict_date_time',
                gte: '2022-07-04T00:00:00.00-04:00',
              },
            },
          },
          {
            range: {
              'receivedAt.S': {
                format: 'strict_date_time',
                lte: '2022-07-05T00:00:00.000-04:00',
              },
            },
          },
        ],
        must_not: {
          term: {
            'status.S': 'Closed',
          },
        },
      },
    },
    sort: [{ 'sortableDocketNumber.N': 'asc' }],
  },
  index: 'efcms-case',
};

const mockOpenCasesReceivedOnJulyFourthSearchHits = [
  {
    _id: 'case|14811-22_case|14811-22',
    _index: efcmsCaseIndex,
    _score: null,
    _source: {
      docketNumber: { S: '14811-22' },
      receivedAt: { S: '2022-07-04T08:01:19.428Z' },
    },
    _type: '_doc',
    sort: [22014811],
  },
  {
    _id: 'case|14812-22_case|14812-22',
    _index: efcmsCaseIndex,
    _score: null,
    _source: {
      docketNumber: { S: '14812-22' },
      receivedAt: { S: '2022-07-04T14:38:28.897Z' },
    },
    _type: '_doc',
    sort: [22014812],
  },
  {
    _id: 'case|14813-22_case|14813-22',
    _index: efcmsCaseIndex,
    _score: null,
    _source: {
      docketNumber: { S: '14813-22' },
      receivedAt: { S: '2022-07-04T15:37:03.358Z' },
    },
    _type: '_doc',
    sort: [22014813],
  },
  {
    _id: 'case|14814-22_case|14814-22',
    _index: efcmsCaseIndex,
    _score: null,
    _source: {
      docketNumber: { S: '14814-22' },
      receivedAt: { S: '2022-07-04T20:09:51.618Z' },
    },
    _type: '_doc',
    sort: [22014814],
  },
  {
    _id: 'case|14815-22_case|14815-22',
    _index: efcmsCaseIndex,
    _score: null,
    _source: {
      docketNumber: { S: '14815-22' },
      receivedAt: { S: '2022-07-04T20:12:17.759Z' },
    },
    _type: '_doc',
    sort: [22014815],
  },
  {
    _id: 'case|14816-22_case|14816-22',
    _index: efcmsCaseIndex,
    _score: null,
    _source: {
      docketNumber: { S: '14816-22' },
      receivedAt: { S: '2022-07-04T22:55:34.927Z' },
    },
    _type: '_doc',
    sort: [22014816],
  },
  {
    _id: 'case|14817-22_case|14817-22',
    _index: efcmsCaseIndex,
    _score: null,
    _source: {
      docketNumber: { S: '14817-22' },
      receivedAt: { S: '2022-07-05T00:47:46.367Z' },
    },
    _type: '_doc',
    sort: [22014817],
  },
];

export const mockOpenCasesReceivedOnJulyFourthCountResult = {
  body: {
    _shards: {
      failed: 0,
      skipped: 0,
      successful: 1,
      total: 1,
    },
    count: 7,
  },
};

export const mockOpenCasesReceivedOnJulyFourthSearchResults = {
  body: {
    _shards: {
      failed: 0,
      skipped: 0,
      successful: 1,
      total: 1,
    },
    hits: {
      hits: mockOpenCasesReceivedOnJulyFourthSearchHits,
      max_score: null,
      total: {
        relation: 'eq',
        value: 7,
      },
    },
    timed_out: false,
    took: 12,
  },
};

export const mockOpenCasesReceivedOnJulyFourthSearchResult1 = {
  body: {
    _shards: {
      failed: 0,
      skipped: 0,
      successful: 1,
      total: 1,
    },
    hits: {
      hits: mockOpenCasesReceivedOnJulyFourthSearchHits.slice(0, 5),
      max_score: null,
      total: {
        relation: 'eq',
        value: 7,
      },
    },
    timed_out: false,
    took: 11,
  },
};

export const mockOpenCasesReceivedOnJulyFourthSearchResult2 = {
  body: {
    _shards: {
      failed: 0,
      skipped: 0,
      successful: 1,
      total: 1,
    },
    hits: {
      hits: mockOpenCasesReceivedOnJulyFourthSearchHits.slice(5),
      max_score: null,
      total: {
        relation: 'eq',
        value: 7,
      },
    },
    timed_out: false,
    took: 4,
  },
};

export const mockOpenCasesReceivedOnJulyFourthFormattedResults = {
  body: {
    aggregations: undefined,
    results: mockOpenCasesReceivedOnJulyFourthSearchHits.map(hit => {
      return {
        _score: hit._score,
        docketNumber: hit._source.docketNumber.S,
        receivedAt: hit._source.receivedAt.S,
        sort: hit.sort,
      };
    }),
    total: 7,
  },
};
