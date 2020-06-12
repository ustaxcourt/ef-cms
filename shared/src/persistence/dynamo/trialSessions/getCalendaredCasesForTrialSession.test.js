const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  getCalendaredCasesForTrialSession,
} = require('./getCalendaredCasesForTrialSession');

describe('getCalendaredCasesForTrialSession', () => {
  beforeEach(() => {
    client.get = jest.fn().mockReturnValue({
      caseOrder: [
        {
          caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          disposition: 'something',
          removedFromTrial: true,
        },
      ],
    });

    client.query = jest.fn().mockReturnValue([
      {
        caseId: '123',
        pk: 'case|123',
        sk: 'case|23',
        status: 'New',
      },
      {
        pk: 'case|123',
        sk: 'irsPractitioner|123',
        userId: 'abc-123',
      },
      {
        pk: 'case|123',
        sk: 'privatePractitioner|123',
        userId: 'abc-123',
      },
      {
        docketRecordId: 'abc-123',
        pk: 'case|123',
        sk: 'docket-record|123',
      },
      {
        documentId: 'abc-123',
        pk: 'case|123',
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
        caseId: '123',
        correspondence: [],
        disposition: 'something',
        docketRecord: [
          {
            docketRecordId: 'abc-123',
            pk: 'case|123',
            sk: 'docket-record|123',
          },
        ],
        documents: [
          {
            documentId: 'abc-123',
            pk: 'case|123',
            sk: 'document|123',
          },
        ],
        irsPractitioners: [
          {
            pk: 'case|123',
            sk: 'irsPractitioner|123',
            userId: 'abc-123',
          },
        ],
        pk: 'case|123',
        privatePractitioners: [
          {
            pk: 'case|123',
            sk: 'privatePractitioner|123',
            userId: 'abc-123',
          },
        ],
        removedFromTrial: true,
        sk: 'case|23',
        status: 'New',
      },
    ]);
  });
});
