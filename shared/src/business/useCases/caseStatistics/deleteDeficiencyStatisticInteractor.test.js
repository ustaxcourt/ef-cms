const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  deleteDeficiencyStatisticInteractor,
} = require('./deleteDeficiencyStatisticInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { User } = require('../../entities/User');

describe('deleteDeficiencyStatisticInteractor', () => {
  let statistic = {
    determinationDeficiencyAmount: 123,
    determinationTotalPenalties: 456,
    irsDeficiencyAmount: 789,
    irsTotalPenalties: 1.1,
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
        Promise.resolve({ ...MOCK_CASE, statistics: [statistic, statistic] }),
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
      statisticIndex: 0,
    });
    expect(result).toMatchObject({
      statistics: [statistic],
    });
  });

  it('should call updateCase with the original case statistics and return the original case if statisticIndex is not present on the case', async () => {
    const result = await deleteDeficiencyStatisticInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      statisticIndex: 2,
    });
    expect(result).toMatchObject({
      statistics: [statistic, statistic],
    });
  });
});
