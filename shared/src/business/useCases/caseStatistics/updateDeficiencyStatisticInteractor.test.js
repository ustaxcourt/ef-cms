const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateDeficiencyStatisticInteractor,
} = require('./updateDeficiencyStatisticInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');

describe('updateDeficiencyStatisticInteractor', () => {
  let statistic = {
    determinationDeficiencyAmount: 123,
    determinationTotalPenalties: 456,
    irsDeficiencyAmount: 789,
    irsTotalPenalties: 1.1,
    statisticId: '7452b87f-7ba3-45c7-ae4b-bd1eab37c866',
    year: 2012,
    yearOrPeriod: 'Year',
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({ ...MOCK_CASE, statistics: [statistic] }),
      );

    applicationContext
      .getPersistenceGateway()
      .getFullCaseByDocketNumber.mockReturnValue(
        Promise.resolve({ ...MOCK_CASE, statistics: [statistic] }),
      );
  });

  it('should throw an error if the user is unauthorized to update case statistics', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateDeficiencyStatisticInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for editing statistics');
  });

  it('should call updateCase with the updated case statistics and return the updated case', async () => {
    const statisticToUpdate = {
      ...statistic,
      determinationDeficiencyAmount: 1,
    };

    const result = await updateDeficiencyStatisticInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        statisticId: '7452b87f-7ba3-45c7-ae4b-bd1eab37c866',
        ...statisticToUpdate,
      },
    );
    expect(result).toMatchObject({
      statistics: [statisticToUpdate],
    });
  });

  it('should call updateCase with the original case statistics and return the original case if statisticId is not present on the case', async () => {
    const statisticToUpdate = {
      ...statistic,
      determinationDeficiencyAmount: 1,
      statisticId: 'a3f2aa54-ad95-4396-b1a9-2d90d9e22242',
    };

    const result = await updateDeficiencyStatisticInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        statisticId: 'a3f2aa54-ad95-4396-b1a9-2d90d9e22242',
        ...statisticToUpdate,
      },
    );
    expect(result).toMatchObject({
      statistics: [statistic],
    });
  });
});
