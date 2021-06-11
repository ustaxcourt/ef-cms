const {
  addDeficiencyStatisticInteractor,
} = require('./addDeficiencyStatisticInteractor');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');

describe('addDeficiencyStatisticInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(Promise.resolve(MOCK_CASE));
  });

  it('should throw an error if the user is unauthorized to update case statistics', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      addDeficiencyStatisticInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for editing statistics');
  });

  it('should call updateCase with the updated case statistics and return the updated case', async () => {
    const statistic = {
      determinationDeficiencyAmount: 123,
      determinationTotalPenalties: 456,
      irsDeficiencyAmount: 789,
      irsTotalPenalties: 1.1,
      year: 2012,
      yearOrPeriod: 'Year',
    };

    const result = await addDeficiencyStatisticInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      ...statistic,
    });
    expect(result).toMatchObject({
      statistics: [statistic],
    });
  });
});
