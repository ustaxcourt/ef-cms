const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getConsolidatedCasesForLeadCase,
} = require('./getConsolidatedCasesForLeadCase');
const { MOCK_CASE } = require('../../../test/mockCase');
const { UserCase } = require('../../entities/UserCase');

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

  it('should only return UserCase fields', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockReturnValue([MOCK_CASE]);

    const consolidatedCases = await getConsolidatedCasesForLeadCase({
      applicationContext,
      leadDocketNumber: '123-20',
    });

    const userCase = new UserCase(MOCK_CASE, { applicationContext });

    expect(consolidatedCases).toEqual([userCase.toRawObject()]);
  });

  it('should validate the retrieved cases as UserCase entities', async () => {
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
    ).rejects.toThrow('The UserCase entity was invalid');
  });
});
