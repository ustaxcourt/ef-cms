import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_LOCK } from '../../../test/mockLock';
import { MOCK_PRACTITIONER } from '../../../test/mockUsers';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import {
  determineEntitiesToLock,
  handleLockError,
  verifyUserPendingEmailInteractor,
} from './verifyUserPendingEmailInteractor';

const TOKEN = '41189629-abe1-46d7-b7a4-9d3834f919cb';

describe('determineEntitiesToLock', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue(['111-20', '222-20', '333-20']);
    applicationContext.getCurrentUser.mockReturnValue(MOCK_PRACTITIONER);
  });

  it('should lookup the docket numbers for the current user', async () => {
    await determineEntitiesToLock(applicationContext);
    expect(
      applicationContext.getPersistenceGateway().getDocketNumbersByUser,
    ).toHaveBeenCalledWith({
      applicationContext,
      userId: MOCK_PRACTITIONER.userId,
    });
  });
  it('should return an object that includes all of the docketNumbers associated with the user', async () => {
    const { identifiers } = await determineEntitiesToLock(applicationContext);

    expect(identifiers).toContain('case|111-20');
    expect(identifiers).toContain('case|222-20');
    expect(identifiers).toContain('case|333-20');
  });
});

describe('handleLockError', () => {
  it('should determine who the user is based on applicationContext', async () => {
    await handleLockError(applicationContext, { foo: 'bar' });
    expect(applicationContext.getCurrentUser).toHaveBeenCalled();
  });

  it('should send a notification to the user with "retry_async_request" and the originalRequest', async () => {
    const mockOriginalRequest = {
      foo: 'bar',
    };
    await handleLockError(applicationContext, mockOriginalRequest);
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message,
    ).toMatchObject({
      action: 'retry_async_request',
      originalRequest: mockOriginalRequest,
      requestToRetry: 'verify_user_pending_email',
    });
  });
});

describe('verifyUserPendingEmailInteractor', () => {
  let mockLock;

  const mockRequest = {
    token: TOKEN,
  };

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined; // unlocked

    applicationContext.getCurrentUser.mockReturnValue(MOCK_PRACTITIONER);

    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...MOCK_PRACTITIONER,
      entityName: 'Practitioner',
      pendingEmailVerificationToken: TOKEN,
    });

    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockReturnValue(true);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue([MOCK_CASE.docketNumber]);
  });

  describe('locked', () => {
    beforeEach(() => {
      mockLock = MOCK_LOCK;
    });

    it('should throw a ServiceUnavailableError if a Case is currently locked', async () => {
      await expect(
        verifyUserPendingEmailInteractor(applicationContext, mockRequest),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getPersistenceGateway().getCaseByDocketNumber,
      ).not.toHaveBeenCalled();
    });

    it('should return a "retry_async_request" notification with the original request', async () => {
      await expect(
        verifyUserPendingEmailInteractor(applicationContext, mockRequest),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getNotificationGateway().sendNotificationToUser,
      ).toHaveBeenCalledWith({
        applicationContext,
        message: {
          action: 'retry_async_request',
          originalRequest: mockRequest,
          requestToRetry: 'verify_user_pending_email',
        },
        userId: MOCK_PRACTITIONER.userId,
      });

      expect(
        applicationContext.getPersistenceGateway().getCaseByDocketNumber,
      ).not.toHaveBeenCalled();
    });
  });

  describe('not locked', () => {
    beforeEach(() => {
      mockLock = undefined;
    });

    it('should acquire a lock that lasts for 15 minutes', async () => {
      await verifyUserPendingEmailInteractor(applicationContext, mockRequest);

      expect(
        applicationContext.getPersistenceGateway().createLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifier: `case|${MOCK_CASE.docketNumber}`,
        ttl: 900,
      });
    });

    it('should remove the lock', async () => {
      await verifyUserPendingEmailInteractor(applicationContext, mockRequest);

      expect(
        applicationContext.getPersistenceGateway().removeLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      });
    });
  });
});
