const {
  getCasePrivatePractitioners,
} = require('./getCasePrivatePractitioners');

describe('getCasePrivatePractitioners', () => {
  let applicationContext;
  let queryStub;

  beforeEach(() => {
    queryStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            name: 'Private Practitioner',
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

  it('retrieves the privatePractitioners for a case', async () => {
    const result = await getCasePrivatePractitioners({ applicationContext })({
      caseId: 'abc-123',
    });

    expect(result).toMatchObject({
      caseId: 'abc-123',
      privatePractitioners: [
        {
          name: 'Private Practitioner',
        },
      ],
    });
  });
});
