/* eslint-disable max-lines */
import { efcmsCaseIndex } from '../../../elasticsearch/efcms-case-mappings';
import { efcmsDocketEntryIndex } from '../../../elasticsearch/efcms-docket-entry-mappings';
import { efcmsMessageIndex } from '../../../elasticsearch/efcms-message-mappings';
import { efcmsWorkItemIndex } from '../../../elasticsearch/efcms-work-item-mappings';

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

export const mockMessageSearchResult = {
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
          _id: 'case|312-21_message|25100ec6-eeeb-4e88-872f-c99fad1fe6c7',
          _index: efcmsMessageIndex,
          _routing: 'case|312-21_case|312-21|mapping',
          _score: null,
          _source: {
            attachments: {
              L: [
                {
                  M: {
                    documentId: {
                      S: '4227bd1d-4bcf-46b0-942f-445cd8024bbe',
                    },
                  },
                },
                {
                  M: {
                    documentId: {
                      S: '67ce8e4d-a64c-41a4-9857-b8ca7ae6b876',
                    },
                  },
                },
              ],
            },
            case_relations: {
              name: 'message',
              parent: 'case|312-21_case|312-21|mapping',
            },
            caseStatus: {
              S: 'Closed',
            },
            caseTitle: {
              S: 'Case 312-21',
            },
            createdAt: {
              S: '2021-09-02T03:00:45.330Z',
            },
            docketNumber: {
              S: '312-21',
            },
            docketNumberWithSuffix: {
              S: '312-21',
            },
            entityName: {
              S: 'Message',
            },
            from: {
              S: 'Buch',
            },
            fromSection: {
              S: 'buchsChambers',
            },
            fromUserId: {
              S: '06b6fb09-889f-427d-9d45-b99023f6539b',
            },
            gsi1pk: {
              S: 'message|25100ec6-eeeb-4e88-872f-c99fad1fe6c7',
            },
            isCompleted: {
              BOOL: false,
            },
            isRead: {
              BOOL: true,
            },
            isRepliedTo: {
              BOOL: true,
            },
            message: {
              S: 'Thanks!',
            },
            messageId: {
              S: '25100ec6-eeeb-4e88-872f-c99fad1fe6c7',
            },
            parentMessageId: {
              S: '25100ec6-eeeb-4e88-872f-c99fad1fe6c7',
            },
            pk: {
              S: 'case|312-21',
            },
            sk: {
              S: 'message|25100ec6-eeeb-4e88-872f-c99fad1fe6c7',
            },
            subject: {
              S: 'Order',
            },
            to: {
              S: 'Docket Clerk 1',
            },
            toSection: {
              S: 'buchsChambers',
            },
            toUserId: {
              S: 'b6570a72-f6df-4f41-8256-ea2edb51d665',
            },
          },
          _type: '_doc',
          inner_hits: {
            'case-mappings': {
              hits: {
                hits: [
                  {
                    _id: 'case|312-21_case|312-21|mapping',
                    _index: efcmsMessageIndex,
                    _score: 1,
                    _source: {
                      leadDocketNumber: {
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

export const mockWorkItemSearchResult = {
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
          _id: 'case|312-work-item|7ab75b20-0127-4fff-a4e2-1b839585e668',
          _index: efcmsWorkItemIndex,
          _routing: 'case|312-21_case|312-21|mapping',
          _score: null,
          _source: {
            assigneeId: {
              S: 'f50fbb1e-e0c9-47f5-aae7-aa221bdd364a',
            },
            assigneeName: {
              S: 'Docket Clerk 1',
            },
            case_relations: {
              name: 'workItem',
              parent:
                'user-outbox|f50fbb1e-e0c9-47f5-aae7-aa221bdd364a|2021-w6_user-outbox|f50fbb1e-e0c9-47f5-aae7-aa221bdd364a|2021-w6|mapping',
            },
            completedAt: {
              S: '2021-02-12T20:05:52.401Z',
            },
            completedBy: {
              S: 'Docket Clerk 1',
            },
            completedByUserId: {
              S: 'f50fbb1e-e0c9-47f5-aae7-aa221bdd364a',
            },
            completedMessage: {
              S: 'completed',
            },
            createdAt: {
              S: '2021-02-11T16:50:30.851Z',
            },
            docketNumber: {
              S: '312-21',
            },
            docketNumberWithSuffix: {
              S: '312-21',
            },
            entityName: {
              S: 'WorkItem',
            },
            gsi1pk: {
              S: 'work-item|7ab75b20-0127-4fff-a4e2-1b839585e668',
            },
            highPriority: {
              BOOL: false,
            },
            pk: {
              S: 'user-outbox|f50fbb1e-e0c9-47f5-aae7-aa221bdd364a|2021-w6',
            },
            sentBy: {
              S: 'docketclerk1@example.com',
            },
            sentBySection: {
              S: 'docket',
            },
            sentByUserId: {
              S: 'f50fbb1e-e0c9-47f5-aae7-aa221bdd364a',
            },
            sk: {
              S: '2021-02-12T20:05:52.401Z',
            },
            updatedAt: {
              S: '2021-02-11T16:50:30.851Z',
            },
            workItemId: {
              S: '7ab75b20-0127-4fff-a4e2-1b839585e668',
            },
          },
          _type: '_doc',
          inner_hits: {
            'case-mappings': {
              hits: {
                hits: [
                  {
                    _id: 'case|312-21_case|312-21|mapping',
                    _index: efcmsWorkItemIndex,
                    _score: 1,
                    _source: {
                      leadDocketNumber: {
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

export const openCasesReceivedOnJulyFourthSearchParameters = {
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
    results: [
      {
        _score: null,
        docketNumber: '14811-22',
        receivedAt: '2022-07-04T08:01:19.428Z',
      },
      {
        _score: null,
        docketNumber: '14812-22',
        receivedAt: '2022-07-04T14:38:28.897Z',
      },
      {
        _score: null,
        docketNumber: '14813-22',
        receivedAt: '2022-07-04T15:37:03.358Z',
      },
      {
        _score: null,
        docketNumber: '14814-22',
        receivedAt: '2022-07-04T20:09:51.618Z',
      },
      {
        _score: null,
        docketNumber: '14815-22',
        receivedAt: '2022-07-04T20:12:17.759Z',
      },
      {
        _score: null,
        docketNumber: '14816-22',
        receivedAt: '2022-07-04T22:55:34.927Z',
      },
      {
        _score: null,
        docketNumber: '14817-22',
        receivedAt: '2022-07-05T00:47:46.367Z',
      },
    ],
    total: 7,
  },
};
