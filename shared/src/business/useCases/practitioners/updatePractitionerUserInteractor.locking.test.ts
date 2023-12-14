import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_LOCK } from '../../../test/mockLock';
import {
  MOCK_PRACTITIONER,
  admissionsClerkUser,
} from '../../../test/mockUsers';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import {
  determineEntitiesToLock,
  handleLockError,
  updatePractitionerUserInteractor,
} from './updatePractitionerUserInteractor';

describe('determineEntitiesToLock', () => {
  const mockPractitioner: RawPractitioner = MOCK_PRACTITIONER;
  let mockParams;
  beforeEach(() => {
    mockParams = {
      barNumber: 'pt101',
      user: mockPractitioner,
    };
    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue(['111-20', '222-20', '333-20']);
  });
  it('should lookup the docket numbers for the specified user', async () => {
    await determineEntitiesToLock(applicationContext, mockParams);
    expect(
      applicationContext.getPersistenceGateway().getDocketNumbersByUser,
    ).toHaveBeenCalledWith({
      applicationContext,
      userId: mockPractitioner.userId,
    });
  });
  it('should return an object that includes all of the docketNumbers associated with the user', async () => {
    const { identifiers } = await determineEntitiesToLock(
      applicationContext,
      mockParams,
    );

    expect(identifiers).toContain('case|111-20');
    expect(identifiers).toContain('case|222-20');
    expect(identifiers).toContain('case|333-20');
  });
});

describe('handleLockError', () => {
  const mockClientConnectionId = '987654';

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(admissionsClerkUser);
  });

  it('should determine who the user is based on applicationContext', async () => {
    await handleLockError(applicationContext, { foo: 'bar' });
    expect(applicationContext.getCurrentUser).toHaveBeenCalled();
  });

  it('should send a notification to the user with "retry_async_request" and the originalRequest', async () => {
    const mockOriginalRequest = {
      clientConnectionId: mockClientConnectionId,
      foo: 'bar',
    };
    await handleLockError(applicationContext, mockOriginalRequest);
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message,
    ).toMatchObject({
      action: 'retry_async_request',
      originalRequest: mockOriginalRequest,
      requestToRetry: 'update_practitioner_user',
    });
  });
});

describe('updatePractitionerUserInteractor', () => {
  let mockLock;
  const mockRequest = {
    barNumber: 'ab1234',
    bypassDocketEntry: false,
    user: MOCK_PRACTITIONER,
  };

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);

    applicationContext
      .getPersistenceGateway()
      .getPractitionerByBarNumber.mockReturnValue(MOCK_PRACTITIONER);

    applicationContext
      .getPersistenceGateway()
      .updatePractitionerUser.mockImplementation(({ user }) => user);
  });

  beforeEach(() => {
    mockLock = undefined; // unlocked
    applicationContext.getCurrentUser.mockReturnValue(admissionsClerkUser);

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
        updatePractitionerUserInteractor(applicationContext, mockRequest),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getPersistenceGateway().getCaseByDocketNumber,
      ).not.toHaveBeenCalled();
    });

    it('should return a "retry_async_request" notification with the original request', async () => {
      await expect(
        updatePractitionerUserInteractor(applicationContext, mockRequest),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getNotificationGateway().sendNotificationToUser,
      ).toHaveBeenCalledWith({
        applicationContext,
        message: {
          action: 'retry_async_request',
          originalRequest: mockRequest,
          requestToRetry: 'update_practitioner_user',
        },
        userId: admissionsClerkUser.userId,
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
      await updatePractitionerUserInteractor(applicationContext, mockRequest);

      expect(
        applicationContext.getPersistenceGateway().createLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifier: `case|${MOCK_CASE.docketNumber}`,
        ttl: 900,
      });
    });
    it('should remove the lock', async () => {
      await updatePractitionerUserInteractor(applicationContext, mockRequest);

      expect(
        applicationContext.getPersistenceGateway().removeLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      });
    });
  });
});
