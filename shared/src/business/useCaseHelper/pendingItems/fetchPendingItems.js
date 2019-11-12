const AWS = require('aws-sdk');
const { get } = require('lodash');

const MOCK_PENDING = [
  {
    addToCoversheet: true,
    additionalInfo: 'Non architecto nihil',
    additionalInfo2: 'Non doloribus laboru',
    associatedJudge: 'Judge Thornton',
    attachments: false,
    caseCaption: 'Eos culpa et obcaeca',
    caseId: 'd9fbc60e-b9a0-4cf3-b039-b1dba5d227d0',
    category: 'Petition',
    certificateOfServiceDate: null,
    createdAt: '2019-10-24',
    docketNumber: '103-19',
    docketNumberSuffix: null,
    documentId: '15d65fe9-0374-4e8b-82e1-546659520748',
    documentTitle: 'Amended Petition',
    documentType: 'Amended Petition',
    eventCode: 'PAP',
    filedBy: 'Resp. & Petr. Alika Jacobson',
    isFileAttached: false,
    isPaper: true,
    lodged: false,
    partyPrimary: true,
    partyRespondent: true,
    pending: true,
    practitioner: [],
    processingStatus: 'pending',
    receivedAt: '2019-10-24',
    relationship: 'primaryDocument',
    scenario: 'Standard',
    status: 'Calendared',
    userId: '1f1a0a03-f023-4be4-9a96-452424c46adc',
    workItems: [
      {
        assigneeId: '1f1a0a03-f023-4be4-9a96-452424c46adc',
        assigneeName: 'Test docketclerk1',
        caseId: 'd9fbc60e-b9a0-4cf3-b039-b1dba5d227d0',
        caseStatus: 'Calendared',
        caseTitle: 'Alika Jacobson, Michelle Knowles, Guardian',
        createdAt: '2019-11-11T13:57:13.854Z',
        docketNumber: '103-19',
        docketNumberSuffix: null,
        document: {
          addToCoversheet: true,
          additionalInfo: 'Non architecto nihil',
          additionalInfo2: 'Non doloribus laboru',
          attachments: false,
          caseId: 'd9fbc60e-b9a0-4cf3-b039-b1dba5d227d0',
          category: 'Petition',
          certificateOfServiceDate: null,
          createdAt: '2019-10-24',
          docketNumber: '103-19',
          documentId: '15d65fe9-0374-4e8b-82e1-546659520748',
          documentTitle: 'Amended Petition',
          documentType: 'Amended Petition',
          eventCode: 'PAP',
          filedBy: 'Resp. & Petr. Alika Jacobson',
          isFileAttached: false,
          isPaper: true,
          lodged: false,
          partyPrimary: true,
          partyRespondent: true,
          pending: true,
          practitioner: [],
          processingStatus: 'pending',
          receivedAt: '2019-10-24',
          relationship: 'primaryDocument',
          scenario: 'Standard',
          userId: '1f1a0a03-f023-4be4-9a96-452424c46adc',
        },
        isQC: true,
        isRead: true,
        messages: [
          {
            createdAt: '2019-11-11T13:57:13.860Z',
            from: 'Test docketclerk1',
            fromUserId: '1f1a0a03-f023-4be4-9a96-452424c46adc',
            message:
              'Amended Petition filed by Docketclerk is ready for review.',
            messageId: '347c77f0-bdd9-430f-942d-cea92f77a0f2',
          },
        ],
        section: 'docket',
        sentBy: 'Test docketclerk1',
        sentBySection: 'docket',
        sentByUserId: '1f1a0a03-f023-4be4-9a96-452424c46adc',
        updatedAt: '2019-11-11T13:57:13.856Z',
        workItemId: 'ec734baf-a9ef-4cc8-be4b-22272c8f0ca7',
      },
    ],
  },
];

/**
 * fetchPendingItems
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.judge the optional judge filter
 * @returns {Array} the pending items found
 */
exports.fetchPendingItems = async ({ applicationContext, judge }) => {
  const searchParameters = {
    body: {
      _source: [
        'associatedJudge',
        'documents',
        'caseCaption',
        'docketNumber',
        'docketNumberSuffix',
        'status',
      ],
      query: {
        bool: {
          must: [{ match: { 'hasPendingItems.BOOL': true } }],
        },
      },
      size: 5000,
    },
    index: 'efcms',
  };

  if (judge) {
    searchParameters.body.query.bool.must.push({
      match: { 'associatedJudge.S': judge },
    });
  }
  console.log('Search Params?', JSON.stringify(searchParameters, null, 2));

  const body = await applicationContext
    .getSearchClient()
    .search(searchParameters);

  const foundCases = [];
  const hits = get(body, 'hits.hits');

  if (hits && hits.length > 0) {
    hits.forEach(hit => {
      foundCases.push(AWS.DynamoDB.Converter.unmarshall(hit['_source']));
    });
  }

  const foundDocuments = [...MOCK_PENDING];

  foundCases.forEach(foundCase => {
    const { documents, ...mappedProps } = foundCase;

    documents.forEach(document => {
      if (document.pending) {
        foundDocuments.push({
          ...mappedProps,
          ...document,
        });
      }
    });
  });

  return foundDocuments;
};
