import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import { CASE_TYPES_MAP } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { deleteDeficiencyStatisticInteractor } from './deleteDeficiencyStatisticInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { upsertCases as upsertCasesMock } from '@web-api/persistence/postgres/cases/upsertCases';
import { tryGetLock as tryGetLockMock } from '@web-api/persistence/postgres/utils/operation/tryGetLock';
import { releaseLock as releaseLockMock } from '@web-api/persistence/postgres/utils/operation/releaseLock';
import { hashLockId } from '@web-api/persistence/postgres/utils/mutex';

describe('deleteDeficiencyStatisticInteractor', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const upsertCases = jest.mocked(upsertCasesMock);
  const tryGetLock = jest.mocked(tryGetLockMock);
  const releaseLock = jest.mocked(releaseLockMock);

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
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      statistics: [statistic],
    });
  });

  it('should throw an error when the user is unauthorized to update case statistics', async () => {
    await expect(
      deleteDeficiencyStatisticInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
        } as any,
        {} as unknown as UnknownAuthUser,
      ),
    ).rejects.toThrow('Unauthorized for editing statistics');
  });

  it('should delete the statistic and return the updated case', async () => {
    const result = await deleteDeficiencyStatisticInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        statisticId,
      },
      mockDocketClerkUser,
    );
    expect(result).toMatchObject({
      statistics: [],
    });
  });

  it('should not delete any statistics when no statisticId on the case matches the passed in statisticId', async () => {
    const result = await deleteDeficiencyStatisticInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        statisticId: '8b864301-a0d9-43aa-8029-e1a0ed8ad4c9',
      },
      mockDocketClerkUser,
    );
    expect(result).toMatchObject({
      statistics: [statistic],
    });
  });

  it('should throw an error and not update the case when attempting to delete the only statistic from a deficiency case with hasVerifiedIrsNotice true (at least one statistic is required)', async () => {
    getCaseByDocketNumber.mockReturnValue(
      Promise.resolve({
        ...MOCK_CASE,
        caseType: CASE_TYPES_MAP.deficiency,
        hasVerifiedIrsNotice: true,
        statistics: [statistic],
      }),
    );

    await expect(
      deleteDeficiencyStatisticInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
          statisticId: statistic.statisticId,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('The Case entity was invalid');
    expect(upsertCases).not.toHaveBeenCalled();
  });

  it('should throw a ServiceUnavailableError when the Case is currently locked', async () => {
    tryGetLock.mockResolvedValueOnce(false);

    await expect(
      deleteDeficiencyStatisticInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
          statisticId: '8b864301-a0d9-43aa-8029-e1a0ed8ad4c9',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await deleteDeficiencyStatisticInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        statisticId: '8b864301-a0d9-43aa-8029-e1a0ed8ad4c9',
      },
      mockDocketClerkUser,
    );

    expect(tryGetLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );

    expect(releaseLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );
  });
});
