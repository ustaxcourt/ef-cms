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
      archivedDocketEntries: [],
      correspondence: [],
      docketEntries: [],
      docketNumber: '123-20',
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
              archived: true,
              docketEntryId: 'abc-123',
              pk: 'case|123-20',
              sk: 'docket-entry|123',
            },
            {
              archived: false,
              docketEntryId: 'abc-124',
              pk: 'case|123-20',
              sk: 'docket-entry|124',
            },
            {
              archived: true,
              correspondenceId: 'abc-123',
              pk: 'case|123-20',
              sk: 'correspondence|123',
            },
            {
              archived: false,
              correspondenceId: 'abc-124',
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
          correspondenceId: 'abc-123',
          pk: 'case|123-20',
          sk: 'correspondence|123',
        },
      ],
      archivedDocketEntries: [
        {
          archived: true,
          docketEntryId: 'abc-123',
          pk: 'case|123-20',
          sk: 'docket-entry|123',
        },
      ],
      correspondence: [
        {
          archived: false,
          correspondenceId: 'abc-124',
          pk: 'case|123-20',
          sk: 'correspondence|124',
        },
      ],
      docketEntries: [
        {
          archived: false,
          docketEntryId: 'abc-124',
          pk: 'case|123-20',
          sk: 'docket-entry|124',
        },
      ],
      docketNumber: '123-20',
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
      archivedDocketEntries: [],
      correspondence: [],
      docketEntries: [],
      irsPractitioners: [],
      privatePractitioners: [],
    });
  });
});
