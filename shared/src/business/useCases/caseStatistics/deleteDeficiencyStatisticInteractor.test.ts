import { CASE_TYPES_MAP, ROLES } from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_LOCK } from '../../../test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { deleteDeficiencyStatisticInteractor } from './deleteDeficiencyStatisticInteractor';

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
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({ ...MOCK_CASE, statistics: [statistic] }),
      );
  });

  it('should throw an error if the user is unauthorized to update case statistics', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      deleteDeficiencyStatisticInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      } as any),
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
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
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
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
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
    ).not.toHaveBeenCalled();
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      deleteDeficiencyStatisticInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
        statisticId: '8b864301-a0d9-43aa-8029-e1a0ed8ad4c9',
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await deleteDeficiencyStatisticInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
      statisticId: '8b864301-a0d9-43aa-8029-e1a0ed8ad4c9',
    });

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
});
