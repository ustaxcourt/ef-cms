import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_LOCK } from '../../../../../shared/src/test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { addDeficiencyStatisticInteractor } from './addDeficiencyStatisticInteractor';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('addDeficiencyStatisticInteractor', () => {
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
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(Promise.resolve(MOCK_CASE));
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

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

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });

  it('should throw an error if the user is unauthorized to update case statistics', async () => {
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
