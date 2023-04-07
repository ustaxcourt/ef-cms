import { MOCK_CASE } from '../../test/mockCase';
import { MOCK_LOCK } from '../../test/mockLock';
import { ROLES } from '../entities/EntityConstants';
import { ServiceUnavailableError } from '../../errors/errors';
import { applicationContext } from '../test/createTestApplicationContext';
import { sealCaseInteractor } from './sealCaseInteractor';

describe('sealCaseInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockReturnValue(undefined);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });
  });

  it('should throw an error if the user is unauthorized to seal a case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.privatePractitioner,
      userId: 'docketClerk',
    });
    await expect(
      sealCaseInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for sealing cases');
  });

  it('should call updateCase with the sealedDate set on the case and return the updated case', async () => {
    const result = await sealCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(result.sealedDate).toBeTruthy();
  });

  it('should send a notification that a case has been sealed', async () => {
    await sealCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(
      applicationContext.getDispatchers().sendNotificationOfSealing,
    ).toHaveBeenCalled();
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockReturnValue(MOCK_LOCK);

    await expect(
      sealCaseInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockReturnValue(undefined);

    await sealCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: MOCK_CASE.docketNumber,
      prefix: 'case',
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: MOCK_CASE.docketNumber,
      prefix: 'case',
    });
  });
});
