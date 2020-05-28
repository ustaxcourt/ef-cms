const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  deleteDeficiencyStatisticInteractor,
} = require('./deleteDeficiencyStatisticInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { User } = require('../../entities/User');

describe('deleteDeficiencyStatisticInteractor', () => {
  const statisticId = 'f7a1cdb5-f534-4d12-a046-86ca3b46ddc4';

  const statistic = {
    determinationDeficiencyAmount: 123,
    determinationTotalPenalties: 456,
    irsDeficiencyAmount: 789,
    irsTotalPenalties: 1.1,
    statisticId,
    year: 2012,
    yearOrPeriod: 'Year',
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.docketClerk,
      userId: 'docketClerk',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(
        Promise.resolve({ ...MOCK_CASE, statistics: [statistic] }),
      );
  });

  it('should throw an error if the user is unauthorized to update case statistics', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      deleteDeficiencyStatisticInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
      }),
    ).rejects.toThrow('Unauthorized for editing statistics');
  });

  it('should call updateCase with the removed case statistics and return the updated case', async () => {
    const result = await deleteDeficiencyStatisticInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      statisticId,
    });
    expect(result).toMatchObject({
      statistics: [],
    });
  });

  it('should call updateCase with the original case statistics and return the original case if statisticId is not present on the case', async () => {
    const result = await deleteDeficiencyStatisticInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      statisticId: '8b864301-a0d9-43aa-8029-e1a0ed8ad4c9',
    });
    expect(result).toMatchObject({
      statistics: [statistic],
    });
  });
});
