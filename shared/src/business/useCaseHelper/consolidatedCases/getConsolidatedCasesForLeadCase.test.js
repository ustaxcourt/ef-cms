const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getConsolidatedCasesForLeadCase,
} = require('./getConsolidatedCasesForLeadCase');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getConsolidatedCasesForLeadCase', () => {
  it('should retrieve all cases associated with the leadCaseId', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadCaseId.mockReturnValue([MOCK_CASE]);

    await getConsolidatedCasesForLeadCase({
      applicationContext,
      casesAssociatedWithUserOrLeadCaseMap: {
        '123': MOCK_CASE,
      },
      leadCaseId: '123',
      userAssociatedCaseIdsMap: {},
    });

    expect(
      applicationContext.getPersistenceGateway().getCasesByLeadCaseId.mock
        .calls[0][0],
    ).toMatchObject({ leadCaseId: '123' });
  });

  it('should validate the retrieved cases', async () => {
    const mockCaseId = '123';
    const invalidMockCase = {
      ...MOCK_CASE,
      docketNumber: undefined,
    };
    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadCaseId.mockResolvedValue([invalidMockCase]);

    await expect(
      getConsolidatedCasesForLeadCase({
        applicationContext,
        casesAssociatedWithUserOrLeadCaseMap: {
          '123': invalidMockCase,
        },
        leadCaseId: mockCaseId,
        userAssociatedCaseIdsMap: {},
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });
});
