import { CASE_STATUS_TYPES, ROLES } from '../entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { MOCK_LOCK } from '../../test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../test/createTestApplicationContext';
import { unblockCaseFromTrialInteractor } from './unblockCaseFromTrialInteractor';

describe('unblockCaseFromTrialInteractor', () => {
  let mockLock;
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: '7ad8dcbc-5978-4a29-8c41-02422b66f410',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        }),
      );
  });
  it('should set the blocked flag to false and remove the blockedReason', async () => {
    const result = await unblockCaseFromTrialInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(result).toMatchObject({
      blocked: false,
      blockedReason: undefined,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords.mock.calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
  });

  it('should throw an unauthorized error if the user has no access to unblock the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      unblockCaseFromTrialInteractor(applicationContext, {
        docketNumber: '123-45',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should not create the trial sort mapping record if the case has no trial city', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          preferredTrialCity: null,
          status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        }),
      );

    await unblockCaseFromTrialInteractor(applicationContext, {
      docketNumber: '123-45',
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      unblockCaseFromTrialInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await unblockCaseFromTrialInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
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
