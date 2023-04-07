import { MOCK_CASE } from '../../test/mockCase';
import { MOCK_LOCK } from '../../test/mockLock';
import { ROLES } from '../entities/EntityConstants';
import { ServiceUnavailableError } from '../../errors/errors';
import { applicationContext } from '../test/createTestApplicationContext';
import { unsealCaseInteractor } from './unsealCaseInteractor';

describe('unsealCaseInteractor', () => {
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

  it('should throw an error if the user is unauthorized to unseal a case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
    });

    await expect(
      unsealCaseInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for unsealing cases');
  });

  it('should call updateCase with isSealed set to false and return the updated case', async () => {
    const result = await unsealCaseInteractor(applicationContext, {
      docketNumber: MOCK_CASE.docketNumber,
    });
    expect(result.isSealed).toBe(false);
    expect(result.sealedDate).toBe(undefined);
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockReturnValue(MOCK_LOCK);

    await expect(
      unsealCaseInteractor(applicationContext, {
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

    await unsealCaseInteractor(applicationContext, {
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
