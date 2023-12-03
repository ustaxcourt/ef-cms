import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_LOCK } from '../../../test/mockLock';
import { ROLES } from '../../entities/EntityConstants';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { updateOtherStatisticsInteractor } from './updateOtherStatisticsInteractor';

describe('updateOtherStatisticsInteractor', () => {
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
      .getCaseByDocketNumber.mockReturnValue(Promise.resolve(MOCK_CASE));
  });

  it('should throw an error if the user is unauthorized to update case statistics', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateOtherStatisticsInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      } as any),
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
  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      updateOtherStatisticsInteractor(applicationContext, {
        damages: 1234,
        docketNumber: MOCK_CASE.docketNumber,
        litigationCosts: 5678,
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await updateOtherStatisticsInteractor(applicationContext, {
      damages: 1234,
      docketNumber: MOCK_CASE.docketNumber,
      litigationCosts: 5678,
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
