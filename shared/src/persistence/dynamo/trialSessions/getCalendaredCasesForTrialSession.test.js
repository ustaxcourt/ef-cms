const client = require('../../dynamodbClientService');
const {
  getCalendaredCasesForTrialSession,
} = require('./getCalendaredCasesForTrialSession');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getCalendaredCasesForTrialSession', () => {
  const mockDocketRecord = [
    {
      docketRecordId: '2f2062a4-e019-441d-9aed-775b8d2ad1c0',
      documentId: 'e23e1ab7-9559-4adc-8b0b-daf60dbbbd52',
      index: 0,
      pk: 'case|c54ba5a9-b37b-479d-9201-067ec6e335bb',
      sk: 'docket-record|2f2062a4-e019-441d-9aed-775b8d2ad1c0',
    },
  ];

  let getCaseByCaseIdSpy;

  beforeEach(() => {
    getCaseByCaseIdSpy = jest.fn().mockResolvedValue({
      ...MOCK_CASE,
      docketRecord: mockDocketRecord,
      irsPractitioners: [{ userId: 'abc-123' }],
      privatePractitioners: [{ userId: 'def-123' }],
    });

    client.get = jest.fn().mockReturnValue({
      caseOrder: [
        {
          caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          disposition: 'something',
          removedFromTrial: true,
        },
      ],
    });

    client.batchGet = jest
      .fn()
      .mockReturnValueOnce([{ ...MOCK_CASE, pk: MOCK_CASE.caseId }])
      .mockReturnValueOnce([
        {
          caseId: MOCK_CASE.caseId,
          notes: 'hey this is a note',
          pk: `judges-case-note|${MOCK_CASE.caseId}`,
          sk: '123',
        },
      ]);

    client.query = jest.fn().mockReturnValue(mockDocketRecord);
  });

  it('should get the cases calendared for a trial session', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getPersistenceGateway: () => ({
        getCaseByCaseId: getCaseByCaseIdSpy,
      }),
    };
    const result = await getCalendaredCasesForTrialSession({
      applicationContext,
    });
    expect(result).toMatchObject([
      {
        ...MOCK_CASE,
        disposition: 'something',
        docketRecord: mockDocketRecord,
        irsPractitioners: [{ userId: 'abc-123' }],
        privatePractitioners: [{ userId: 'def-123' }],
        removedFromTrial: true,
      },
    ]);
  });
});
