import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import { tryGetLock as tryGetLockMock } from '@web-api/persistence/postgres/utils/operation/tryGetLock';
import { releaseLock as releaseLockMock } from '@web-api/persistence/postgres/utils/operation/releaseLock';
import { hashLockId } from '@web-api/persistence/postgres/utils/mutex';
import { MOCK_CASE } from '@shared/test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { addDeficiencyStatisticInteractor } from './addDeficiencyStatisticInteractor';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('addDeficiencyStatisticInteractor', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const tryGetLock = jest.mocked(tryGetLockMock);
  const releaseLock = jest.mocked(releaseLockMock);

  const mockStatistic = {
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
    year: 2012,
    yearOrPeriod: 'Year',
  };

  beforeEach(() => {
    getCaseByDocketNumber.mockReturnValue(Promise.resolve(MOCK_CASE));
  });

  it('should throw a ServiceUnavailableError when the Case is currently locked', async () => {
    tryGetLock.mockResolvedValueOnce(false);

    await expect(
      addDeficiencyStatisticInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
          ...mockStatistic,
        } as any,
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await addDeficiencyStatisticInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        ...mockStatistic,
      } as any,
      mockDocketClerkUser,
    );

    expect(tryGetLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );

    expect(releaseLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );
  });

  it('should throw an error when the user is unauthorized to update case statistics', async () => {
    await expect(
      addDeficiencyStatisticInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
        } as any,
        undefined,
      ),
    ).rejects.toThrow('Unauthorized for editing statistics');
  });

  it('should call updateCase with the updated case statistics and return the updated case', async () => {
    const result = await addDeficiencyStatisticInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        ...mockStatistic,
      } as any,
      mockDocketClerkUser,
    );

    expect(result).toMatchObject({
      statistics: [mockStatistic],
    });
  });
});
