const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateOtherStatisticsInteractor,
} = require('./updateOtherStatisticsInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');

describe('updateOtherStatisticsInteractor', () => {
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
      updateOtherStatisticsInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for editing statistics');
  });

  it('should call updateCase with the updated case statistics and return the updated case', async () => {
    const result = await updateOtherStatisticsInteractor(applicationContext, {
      damages: 1234,
      docketNumber: MOCK_CASE.docketNumber,
      litigationCosts: 5678,
    });
    expect(result).toMatchObject({
      damages: 1234,
      litigationCosts: 5678,
    });
  });
});
