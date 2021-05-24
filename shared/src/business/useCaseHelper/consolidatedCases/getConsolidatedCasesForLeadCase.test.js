const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getConsolidatedCasesForLeadCase,
} = require('./getConsolidatedCasesForLeadCase');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getConsolidatedCasesForLeadCase', () => {
  it('should retrieve all cases associated with the leadDocketNumber', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockReturnValue([MOCK_CASE]);

    await getConsolidatedCasesForLeadCase({
      applicationContext,
      leadDocketNumber: '123-20',
    });

    expect(
      applicationContext.getPersistenceGateway().getCasesByLeadDocketNumber.mock
        .calls[0][0],
    ).toMatchObject({ leadDocketNumber: '123-20' });
  });

  it('should validate the retrieved cases', async () => {
    const mockDocketNumber = '234-20';
    const invalidMockCase = {
      ...MOCK_CASE,
      docketNumber: undefined,
    };
    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockResolvedValue([invalidMockCase]);

    await expect(
      getConsolidatedCasesForLeadCase({
        applicationContext,
        leadDocketNumber: mockDocketNumber,
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });
});
