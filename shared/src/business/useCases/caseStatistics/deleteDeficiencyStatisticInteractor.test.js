const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  deleteDeficiencyStatisticInteractor,
} = require('./deleteDeficiencyStatisticInteractor');
const { CASE_TYPES_MAP } = require('../../entities/EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');
const { ROLES } = require('../../entities/EntityConstants');

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
      deleteDeficiencyStatisticInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for editing statistics');
  });

  it('should call updateCase with the removed case statistics and return the updated case', async () => {
    const result = await deleteDeficiencyStatisticInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        statisticId,
      },
    );
    expect(result).toMatchObject({
      statistics: [],
    });
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({ statistics: [] });
  });

  it('should call updateCase with the original case statistics and return the original case if statisticId is not present on the case', async () => {
    const result = await deleteDeficiencyStatisticInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        statisticId: '8b864301-a0d9-43aa-8029-e1a0ed8ad4c9',
      },
    );
    expect(result).toMatchObject({
      statistics: [statistic],
    });
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({ statistics: [statistic] });
  });

  it('should throw an error and not update the case if attempting to delete the only statistic from a deficiency case with hasVerifiedIrsNotice true (at least one statistic is required)', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          caseType: CASE_TYPES_MAP.deficiency,
          hasVerifiedIrsNotice: true,
          statistics: [statistic],
        }),
      );

    await expect(
      deleteDeficiencyStatisticInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        statisticId: statistic.statisticId,
      }),
    ).rejects.toThrow('The Case entity was invalid');
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toBeCalled();
  });
});
