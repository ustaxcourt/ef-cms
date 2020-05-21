const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getCaseByCaseId } = require('./getCaseByCaseId');

describe('getCaseByCaseId', () => {
  it('should return data as received from persistence', async () => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: async () =>
        Promise.resolve({
          Items: [
            {
              caseId: '123',
              pk: 'case|123',
              sk: 'case|123',
              status: 'New',
            },
          ],
        }),
    });

    const result = await getCaseByCaseId({
      applicationContext,
      caseId: '123',
    });

    expect(result).toEqual({
      caseId: '123',
      correspondence: [],
      docketRecord: [],
      documents: [],
      irsPractitioners: [],
      pk: 'case|123',
      privatePractitioners: [],
      sk: 'case|123',
      status: 'New',
    });
  });

  it('should return case and its associated data', async () => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: async () =>
        Promise.resolve({
          Items: [
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
          ],
        }),
    });

    const result = await getCaseByCaseId({
      applicationContext,
      caseId: '123',
    });

    expect(result).toEqual({
      caseId: '123',
      correspondence: [],
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
        { pk: 'case|123', sk: 'irsPractitioner|123', userId: 'abc-123' },
      ],
      pk: 'case|123',
      privatePractitioners: [
        {
          pk: 'case|123',
          sk: 'privatePractitioner|123',
          userId: 'abc-123',
        },
      ],
      sk: 'case|23',
      status: 'New',
    });
  });

  it('should return default object if nothing is returned from the client query request', async () => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: async () => Promise.resolve({ Items: [] }),
    });

    const result = await getCaseByCaseId({
      applicationContext,
      caseId: '123',
    });

    expect(result).toEqual({
      correspondence: [],
      docketRecord: [],
      documents: [],
      irsPractitioners: [],
      privatePractitioners: [],
    });
  });
});
