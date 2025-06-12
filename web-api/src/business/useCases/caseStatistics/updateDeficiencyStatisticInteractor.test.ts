import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { updateDeficiencyStatisticInteractor } from '@web-api/business/useCases/caseStatistics/updateDeficiencyStatisticInteractor';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';

describe('updateDeficiencyStatisticInteractor', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  const statistic = {
    determinationDeficiencyAmount: 123,
    determinationTotalPenalties: 456,
    irsDeficiencyAmount: 789,
    irsTotalPenalties: 1.1,
    penalties: [
      {
        name: 'Penalty 1 (IRS)',
        penaltyAmount: 100.0,
        penaltyType:
          applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT,
      },
      {
        name: 'Penalty 2 (IRS)',
        penaltyAmount: 200.0,
        penaltyType:
          applicationContext.getConstants().PENALTY_TYPES.IRS_PENALTY_AMOUNT,
      },
    ],
    statisticId: '7452b87f-7ba3-45c7-ae4b-bd1eab37c866',
    year: 2012,
    yearOrPeriod: 'Year',
  };

  let authorizedUser: UnknownAuthUser;

  beforeEach(() => {
    authorizedUser = mockDocketClerkUser;

    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      statistics: [statistic],
    });
  });

  it('should throw an error when the user is unauthorized to update case statistics', async () => {
    authorizedUser = {} as unknown as UnknownAuthUser;

    await expect(
      updateDeficiencyStatisticInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
        } as any,
        authorizedUser,
      ),
    ).rejects.toThrow('Unauthorized for editing statistics');
  });

  it('should update the case statistic and return the updated statistic when statisticId is present on the case', async () => {
    const statisticToUpdate = {
      ...statistic,
      determinationDeficiencyAmount: 1,
    };

    const result = await updateDeficiencyStatisticInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        ...statisticToUpdate,
      } as any,
      authorizedUser,
    );
    expect(result).toMatchObject({
      statistics: [statisticToUpdate],
    });
  });

  it('should return the original statistic when statisticId is not present on the case', async () => {
    const statisticToUpdate = {
      ...statistic,
      determinationDeficiencyAmount: 1,
      statisticId: 'a3f2aa54-ad95-4396-b1a9-2d90d9e22242',
    };

    const result = await updateDeficiencyStatisticInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        ...statisticToUpdate,
      } as any,
      authorizedUser,
    );
    expect(result).toMatchObject({
      statistics: [statistic],
    });
  });

  it('should throw a ServiceUnavailableError when the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

    await expect(
      updateDeficiencyStatisticInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
          ...statistic,
        } as any,
        authorizedUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the case', async () => {
    await updateDeficiencyStatisticInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        ...statistic,
      } as any,
      authorizedUser,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      }),
    );
  });
});
