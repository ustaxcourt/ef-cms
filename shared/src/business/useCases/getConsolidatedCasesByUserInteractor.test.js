const {
  getConsolidatedCasesByUserInteractor,
} = require('./getConsolidatedCasesByUserInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_USERS } = require('../../test/mockUsers');

describe('getConsolidatedCasesByUserInteractor', () => {
  beforeEach(() => {});

  it('returns a collection of consolidated cases for the given user id', async () => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
    applicationContext
      .getPersistenceGateway()
      .getCasesByUser.mockImplementation(({ userId }) => {
        const casesByUserId = {
          '74fa8ba9-4f05-45db-9e2d-260a306d0b5e': [
            {
              ...MOCK_CASE,
              caseId: 'e1f7668e-4504-4f33-8c5a-d4dc17f009ee',
              leadCaseId: 'e1f7668e-4504-4f33-8c5a-d4dc17f009ee',
            },
            {
              ...MOCK_CASE,
              caseId: '6ddedc7e-6947-4cfd-a143-833f6de24e95',
            },
            {
              ...MOCK_CASE,
              caseId: '9a1ee699-90d7-4439-a6a8-f910d3441af4',
              leadCaseId: 'f6a764ed-f826-41d4-8214-74e959b19ac1',
            },
          ],
          'ab2dc429-9055-429f-a7a9-06d3d5324b97': [
            {
              ...MOCK_CASE,
              caseId: '8453c80c-b1d5-4975-899c-419ff323a506',
              leadCaseId: '',
            },
          ],
        };

        return casesByUserId[userId];
      });

    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadCaseId.mockImplementation(({ leadCaseId }) => {
        const casesByLeadCaseId = {
          'e1f7668e-4504-4f33-8c5a-d4dc17f009ee': [
            {
              ...MOCK_CASE,
              caseId: 'e1f7668e-4504-4f33-8c5a-d4dc17f009ee',
              leadCaseId: 'e1f7668e-4504-4f33-8c5a-d4dc17f009ee',
            },
            {
              ...MOCK_CASE,
              caseId: 'bd6d4823-92bc-4ea7-a3af-179a07dfda9e',
              docketNumber: '234-02',
              leadCaseId: 'e1f7668e-4504-4f33-8c5a-d4dc17f009ee',
            },
            {
              ...MOCK_CASE,
              caseId: '6ddedc7e-6947-4cfd-a143-833f6de24e95',
              docketNumber: '345-01',
              leadCaseId: 'e1f7668e-4504-4f33-8c5a-d4dc17f009ee',
            },
            {
              ...MOCK_CASE,
              caseId: '8453c80c-b1d5-4975-899c-419ff323a506',
              docketNumber: '456-01',
              leadCaseId: 'e1f7668e-4504-4f33-8c5a-d4dc17f009ee',
            },
          ],
          'f6a764ed-f826-41d4-8214-74e959b19ac1': [
            {
              ...MOCK_CASE,
              caseId: 'f6a764ed-f826-41d4-8214-74e959b19ac1',
              leadCaseId: 'f6a764ed-f826-41d4-8214-74e959b19ac1',
            },
            {
              ...MOCK_CASE,
              caseId: '9a1ee699-90d7-4439-a6a8-f910d3441af4',
              leadCaseId: 'f6a764ed-f826-41d4-8214-74e959b19ac1',
            },
          ],
        };
        return casesByLeadCaseId[leadCaseId];
      });

    const cases = await getConsolidatedCasesByUserInteractor({
      applicationContext,
      userId: '74fa8ba9-4f05-45db-9e2d-260a306d0b5e',
    });

    expect(cases.length).toBeGreaterThan(0);
    expect(cases).toMatchObject([
      {
        caseId: 'e1f7668e-4504-4f33-8c5a-d4dc17f009ee',
        consolidatedCases: [
          {
            caseId: '6ddedc7e-6947-4cfd-a143-833f6de24e95',
            docketNumber: '345-01',
            isRequestingUserAssociated: true,
            leadCaseId: 'e1f7668e-4504-4f33-8c5a-d4dc17f009ee',
          },
          {
            caseId: '8453c80c-b1d5-4975-899c-419ff323a506',
            docketNumber: '456-01',
            isRequestingUserAssociated: false,
            leadCaseId: 'e1f7668e-4504-4f33-8c5a-d4dc17f009ee',
          },
          {
            caseId: 'bd6d4823-92bc-4ea7-a3af-179a07dfda9e',
            docketNumber: '234-02',
            isRequestingUserAssociated: false,
            leadCaseId: 'e1f7668e-4504-4f33-8c5a-d4dc17f009ee',
          },
        ],
        isRequestingUserAssociated: true,
        leadCaseId: 'e1f7668e-4504-4f33-8c5a-d4dc17f009ee',
      },
      {
        caseId: '6ddedc7e-6947-4cfd-a143-833f6de24e95',
        isRequestingUserAssociated: true,
      },
      {
        caseId: 'f6a764ed-f826-41d4-8214-74e959b19ac1',
        consolidatedCases: [
          {
            caseId: '9a1ee699-90d7-4439-a6a8-f910d3441af4',
            isRequestingUserAssociated: true,
            leadCaseId: 'f6a764ed-f826-41d4-8214-74e959b19ac1',
          },
        ],
        isRequestingUserAssociated: false,
        leadCaseId: 'f6a764ed-f826-41d4-8214-74e959b19ac1',
      },
    ]);
  });
});
