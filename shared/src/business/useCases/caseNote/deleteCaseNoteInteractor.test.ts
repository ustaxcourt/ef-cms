import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_LOCK } from '../../../test/mockLock';
import { ROLES } from '../../entities/EntityConstants';
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from '../../../errors/errors';
import { User } from '../../entities/User';
import { applicationContext } from '../../test/createTestApplicationContext';
import { deleteCaseNoteInteractor } from './deleteCaseNoteInteractor';

describe('deleteCaseNoteInteractor', () => {
  beforeEach(() => {
    const mockUser = new User({
      name: 'Judge Colvin',
      role: ROLES.judge,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
    applicationContext.getCurrentUser.mockReturnValue(mockUser);
    applicationContext
      .getPersistenceGateway()
      .getLock.mockReturnValue(undefined);
  });

  it('throws an error if the user is not valid or authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    let error;
    try {
      await deleteCaseNoteInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('deletes a procedural note', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue({
        ...MOCK_CASE,
        caseNote: 'My Procedural Note',
      });

    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(c => c.caseToUpdate);
    applicationContext.getUniqueId.mockReturnValue(
      '09c66c94-7480-4915-8f10-2f2e6e0bf4ad',
    );

    let error;
    let result;

    try {
      result = await deleteCaseNoteInteractor(applicationContext, {
        docketNumber: MOCK_CASE.docketNumber,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(result).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.caseNote).not.toBeDefined();
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockReturnValue(MOCK_LOCK);

    await expect(
      deleteCaseNoteInteractor(applicationContext, {
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

    await deleteCaseNoteInteractor(applicationContext, {
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
