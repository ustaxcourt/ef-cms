import '@web-api/persistence/postgres/cases/mocks.jest';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_LOCK } from '../../../../../shared/src/test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { updateOtherStatisticsInteractor } from './updateOtherStatisticsInteractor';

describe('updateOtherStatisticsInteractor', () => {
  let mockLock;
  let authorizedUser: UnknownAuthUser;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;
    authorizedUser = mockDocketClerkUser;

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(Promise.resolve(MOCK_CASE));
  });

  it('should throw an error if the user is unauthorized to update case statistics', async () => {
    authorizedUser = {} as UnknownAuthUser;

    await expect(
      updateOtherStatisticsInteractor(
        applicationContext,
        { docketNumber: MOCK_CASE.docketNumber } as any,
        authorizedUser,
      ),
    ).rejects.toThrow('Unauthorized for editing statistics');
  });

  it('should call updateCase with the updated case statistics and return the updated case', async () => {
    const result = await updateOtherStatisticsInteractor(
      applicationContext,
      {
        damages: 1234,
        docketNumber: MOCK_CASE.docketNumber,
        litigationCosts: 5678,
      },
      authorizedUser,
    );
    expect(result).toMatchObject({
      damages: 1234,
      litigationCosts: 5678,
    });
  });
  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      updateOtherStatisticsInteractor(
        applicationContext,
        {
          damages: 1234,
          docketNumber: MOCK_CASE.docketNumber,
          litigationCosts: 5678,
        },
        authorizedUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await updateOtherStatisticsInteractor(
      applicationContext,
      {
        damages: 1234,
        docketNumber: MOCK_CASE.docketNumber,
        litigationCosts: 5678,
      },
      authorizedUser,
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
});
