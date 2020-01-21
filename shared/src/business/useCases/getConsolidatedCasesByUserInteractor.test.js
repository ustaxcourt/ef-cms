const {
  getConsolidatedCasesByUserInteractor,
} = require('./getConsolidatedCasesByUserInteractor');

describe('getConsolidatedCasesByUserInteractor', () => {
  beforeEach(() => {});

  it('returns a collection of consolidated cases for the given user id', async () => {
    const applicationContext = {
      getPersistenceGateway: () => ({
        getCasesByLeadCaseId: ({ leadCaseId }) => {
          const casesByLeadCaseId = {
            '001': [
              {
                caseId: '001',
                leadCaseId: '001',
              },
              {
                caseId: '002',
                leadCaseId: '001',
              },
            ],
            '123': [
              {
                caseId: '123',
                leadCaseId: '123',
              },
              {
                caseId: '234',
                docketNumber: '234-02',
                leadCaseId: '123',
              },
              {
                caseId: '345',
                docketNumber: '345-01',
                leadCaseId: '123',
              },
              {
                caseId: '456',
                docketNumber: '456-01',
                leadCaseId: '123',
              },
            ],
          };
          return casesByLeadCaseId[leadCaseId];
        },
        getCasesByUser: ({ userId }) => {
          const casesByUserId = {
            123: [
              {
                caseId: '123',
                leadCaseId: '123',
              },
              {
                caseId: '345',
              },
              {
                caseId: '002',
                leadCaseId: '001',
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
    expect(cases).toEqual([
      {
        caseId: '123',
        consolidatedCases: [
          {
            caseId: '345',
            docketNumber: '345-01',
            isRequestingUserAssociated: true,
            leadCaseId: '123',
          },
          {
            caseId: '456',
            docketNumber: '456-01',
            isRequestingUserAssociated: false,
            leadCaseId: '123',
          },
          {
            caseId: '234',
            docketNumber: '234-02',
            isRequestingUserAssociated: false,
            leadCaseId: '123',
          },
        ],
        isRequestingUserAssociated: true,
        leadCaseId: '123',
      },
      {
        caseId: '345',
        isRequestingUserAssociated: true,
      },
      {
        caseId: '001',
        consolidatedCases: [
          {
            caseId: '002',
            isRequestingUserAssociated: true,
            leadCaseId: '001',
          },
        ],
        isRequestingUserAssociated: false,
        leadCaseId: '001',
      },
    ]);
  });
});
