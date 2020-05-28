const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateDeficiencyStatisticInteractor,
} = require('./updateDeficiencyStatisticInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { User } = require('../../entities/User');

describe('updateDeficiencyStatisticInteractor', () => {
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
        Promise.resolve({ ...MOCK_CASE, statistics: [statistic] }),
      );
  });

  it('should throw an error if the user is unauthorized to update case statistics', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateDeficiencyStatisticInteractor({
        applicationContext,
        caseId: MOCK_CASE.caseId,
      }),
    ).rejects.toThrow('Unauthorized for editing statistics');
  });

  it('should call updateCase with the updated case statistics and return the updated case', async () => {
    const statisticToUpdate = {
      ...statistic,
      determinationDeficiencyAmount: 1,
    };

    const result = await updateDeficiencyStatisticInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      statisticIndex: 0,
      ...statisticToUpdate,
    });
    expect(result).toMatchObject({
      statistics: [statisticToUpdate],
    });
  });

  it('should call updateCase with the original case statistics and return the original case if statisticIndex is not present on the case', async () => {
    const statisticToUpdate = {
      ...statistic,
      determinationDeficiencyAmount: 1,
    };

    const result = await updateDeficiencyStatisticInteractor({
      applicationContext,
      caseId: MOCK_CASE.caseId,
      statisticIndex: 1,
      ...statisticToUpdate,
    });
    expect(result).toMatchObject({
      statistics: [statistic],
    });
  });
});
