const { getCaseIrsPractitioners } = require('./getCaseIrsPractitioners');

describe('getCaseIrsPractitioners', () => {
  let applicationContext;
  let queryStub;

  beforeEach(() => {
    queryStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            name: 'IRS Practitioner',
          },
        ],
      }),
    });

    applicationContext = {
      environment: {
        stage: 'local',
      },
      getDocumentClient: () => ({
        query: queryStub,
      }),
    };
  });

  it('retrieves the irsPractitioners for a case', async () => {
    const result = await getCaseIrsPractitioners({ applicationContext })({
      caseId: 'abc-123',
    });

    expect(result).toMatchObject({
      caseId: 'abc-123',
      irsPractitioners: [
        {
          name: 'IRS Practitioner',
        },
      ],
    });
  });
});
