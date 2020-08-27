const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../../business/entities/EntityConstants');
const {
  getCalendaredCasesForTrialSession,
} = require('./getCalendaredCasesForTrialSession');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getCalendaredCasesForTrialSession', () => {
  beforeEach(() => {
    client.get = jest.fn().mockReturnValue({
      caseOrder: [
        {
          disposition: 'something',
          docketNumber: MOCK_CASE.docketNumber,
          removedFromTrial: true,
        },
      ],
    });

    client.query = jest.fn().mockReturnValue([
      {
        docketNumber: MOCK_CASE.docketNumber,
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: `case|${MOCK_CASE.docketNumber}`,
        status: 'New',
      },
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'irsPractitioner|123',
        userId: 'abc-123',
      },
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'privatePractitioner|123',
        userId: 'abc-123',
      },
      {
        docketRecordId: 'abc-123',
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'docket-record|123',
      },
      {
        documentId: 'abc-123',
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'document|123',
      },
    ]);
  });

  it('should get the cases calendared for a trial session', async () => {
    const result = await getCalendaredCasesForTrialSession({
      applicationContext,
    });
    expect(result).toEqual([
      {
        archivedCorrespondences: [],
        archivedDocuments: [],
        correspondence: [],
        disposition: 'something',
        docketNumber: MOCK_CASE.docketNumber,
        docketRecord: [
          {
            docketRecordId: 'abc-123',
            pk: `case|${MOCK_CASE.docketNumber}`,
            sk: 'docket-record|123',
          },
        ],
        documents: [
          {
            documentId: 'abc-123',
            pk: `case|${MOCK_CASE.docketNumber}`,
            sk: 'document|123',
          },
        ],
        irsPractitioners: [
          {
            pk: `case|${MOCK_CASE.docketNumber}`,
            sk: 'irsPractitioner|123',
            userId: 'abc-123',
          },
        ],
        pk: `case|${MOCK_CASE.docketNumber}`,
        privatePractitioners: [
          {
            pk: `case|${MOCK_CASE.docketNumber}`,
            sk: 'privatePractitioner|123',
            userId: 'abc-123',
          },
        ],
        removedFromTrial: true,
        sk: `case|${MOCK_CASE.docketNumber}`,
        status: CASE_STATUS_TYPES.new,
      },
    ]);
  });
});
