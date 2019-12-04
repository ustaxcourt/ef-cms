const {
  getConsolidatedCasesByUserInteractor,
} = require('./getConsolidatedCasesByUserInteractor');

describe('getConsolidatedCasesByUserInteractor', () => {
  beforeEach(() => {});

  it('returns a collection of consolidated cases for the given user id', async () => {
    const applicationContext = {
      getPersistenceGateway: () => ({
        getConsolidatedCasesByUser: ({ userId }) => {
          const casesByUserId = {
            123: [
              {
                caseId: '123',
                leadCaseId: '123',
              },
              {
                caseId: '234',
                leadCaseId: '123',
              },
              {
                caseId: '345',
                leadCaseId: '123',
              },
            ],
            234: [
              {
                caseId: '456',
                leadCaseId: '',
              },
            ],
          };

          return casesByUserId[userId];
        },
      }),
    };

    const cases = await getConsolidatedCasesByUserInteractor({
      applicationContext,
      userId: '123',
    });

    expect(cases.length).toBeGreaterThan(0);
    expect(cases).toMatchObject([
      {
        caseId: '123',
        consolidatedCases: [
          {
            caseId: '234',
            leadCaseId: '123',
          },
          {
            caseId: '345',
            leadCaseId: '123',
          },
        ],
        leadCaseId: '123',
      },
    ]);
  });
});
