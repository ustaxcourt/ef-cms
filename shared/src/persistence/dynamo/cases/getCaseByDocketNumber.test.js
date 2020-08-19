const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../../business/entities/EntityConstants');
const { getCaseByDocketNumber } = require('./getCaseByDocketNumber');

describe('getCaseByDocketNumber', () => {
  it('should return data as received from persistence', async () => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: async () =>
        Promise.resolve({
          Items: [
            {
              docketNumber: '123-20',
              pk: 'case|123-20',
              sk: 'case|123-20',
              status: CASE_STATUS_TYPES.new,
            },
          ],
        }),
    });

    const result = await getCaseByDocketNumber({
      applicationContext,
      docketNumber: '123-20',
    });

    expect(result).toEqual({
      archivedCorrespondences: [],
      archivedDocuments: [],
      correspondence: [],
      docketNumber: '123-20',
      docketRecord: [],
      documents: [],
      irsPractitioners: [],
      pk: 'case|123-20',
      privatePractitioners: [],
      sk: 'case|123-20',
      status: CASE_STATUS_TYPES.new,
    });
  });

  it('should return case and its associated data', async () => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: async () =>
        Promise.resolve({
          Items: [
            {
              docketNumber: '123-20',
              pk: 'case|123-20',
              sk: 'case|23',
              status: CASE_STATUS_TYPES.new,
            },
            {
              pk: 'case|123-20',
              sk: 'irsPractitioner|123',
              userId: 'abc-123',
            },
            {
              pk: 'case|123-20',
              sk: 'privatePractitioner|123',
              userId: 'abc-123',
            },
            {
              docketRecordId: 'abc-123',
              pk: 'case|123-20',
              sk: 'docket-record|123',
            },
            {
              archived: true,
              documentId: 'abc-123',
              pk: 'case|123-20',
              sk: 'document|123',
            },
            {
              archived: false,
              documentId: 'abc-124',
              pk: 'case|123-20',
              sk: 'document|124',
            },
            {
              archived: true,
              documentId: 'abc-123',
              pk: 'case|123-20',
              sk: 'correspondence|123',
            },
            {
              archived: false,
              documentId: 'abc-124',
              pk: 'case|123-20',
              sk: 'correspondence|124',
            },
          ],
        }),
    });

    const result = await getCaseByDocketNumber({
      applicationContext,
      docketNumber: '123-20',
    });

    expect(result).toEqual({
      archivedCorrespondences: [
        {
          archived: true,
          documentId: 'abc-123',
          pk: 'case|123-20',
          sk: 'correspondence|123',
        },
      ],
      archivedDocuments: [
        {
          archived: true,
          documentId: 'abc-123',
          pk: 'case|123-20',
          sk: 'document|123',
        },
      ],
      correspondence: [
        {
          archived: false,
          documentId: 'abc-124',
          pk: 'case|123-20',
          sk: 'correspondence|124',
        },
      ],
      docketNumber: '123-20',
      docketRecord: [
        {
          docketRecordId: 'abc-123',
          pk: 'case|123-20',
          sk: 'docket-record|123',
        },
      ],
      documents: [
        {
          archived: false,
          documentId: 'abc-124',
          pk: 'case|123-20',
          sk: 'document|124',
        },
      ],
      irsPractitioners: [
        { pk: 'case|123-20', sk: 'irsPractitioner|123', userId: 'abc-123' },
      ],
      pk: 'case|123-20',
      privatePractitioners: [
        {
          pk: 'case|123-20',
          sk: 'privatePractitioner|123',
          userId: 'abc-123',
        },
      ],
      sk: 'case|23',
      status: CASE_STATUS_TYPES.new,
    });
  });

  it('should return default object if nothing is returned from the client query request', async () => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: async () => Promise.resolve({ Items: [] }),
    });

    const result = await getCaseByDocketNumber({
      applicationContext,
      docketNumber: '123-20',
    });

    expect(result).toEqual({
      archivedCorrespondences: [],
      archivedDocuments: [],
      correspondence: [],
      docketRecord: [],
      documents: [],
      irsPractitioners: [],
      privatePractitioners: [],
    });
  });
});
