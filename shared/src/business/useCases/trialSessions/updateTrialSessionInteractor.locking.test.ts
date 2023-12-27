import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_LOCK } from '../../../test/mockLock';
import { MOCK_TRIAL_INPERSON } from '../../../test/mockTrial';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import {
  determineEntitiesToLock,
  handleLockError,
  updateTrialSessionInteractor,
} from './updateTrialSessionInteractor';
import { docketClerkUser } from '../../../test/mockUsers';

describe('determineEntitiesToLock', () => {
  const trialSessionId = '6805d1ab-18d0-43ec-bafb-654e83405416';
  const mockCases = [
    MOCK_CASE,
    { ...MOCK_CASE, docketNumber: '100-23' },
    { ...MOCK_CASE, docketNumber: '101-23' },
  ];
  let mockParams;

  beforeEach(() => {
    mockParams = {
      trialSession: { trialSessionId },
    };
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({ caseOrder: mockCases });
  });

  it('should lookup the specified trial session', async () => {
    await determineEntitiesToLock(applicationContext, mockParams);
    expect(
      applicationContext.getPersistenceGateway().getTrialSessionById,
    ).toHaveBeenCalledWith({
      applicationContext,
      trialSessionId,
    });
  });

  it('should return an object that includes the specified trial session', async () => {
    const { identifiers } = await determineEntitiesToLock(
      applicationContext,
      mockParams,
    );
    expect(identifiers).toContain(
      `trial-session|${mockParams.trialSession.trialSessionId}`,
    );
  });

  it('should return an object that includes all of the docketNumbers associated with the trial session', async () => {
    const { identifiers } = await determineEntitiesToLock(
      applicationContext,
      mockParams,
    );

    expect(identifiers).toContain(`case|${mockCases[1].docketNumber}`);
    expect(identifiers).toContain(`case|${mockCases[0].docketNumber}`);
    expect(identifiers).toContain(`case|${mockCases[2].docketNumber}`);
  });
});

describe('handleLockError', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);
  });

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
      requestToRetry: 'update_trial_session',
    });
  });
});

describe('updateTrialSessionInteractor', () => {
  let mockRequest = {
    clientConnectionId: '987654',
    trialSession: MOCK_TRIAL_INPERSON,
  };
  let mockLock;

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(MOCK_TRIAL_INPERSON);

    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);

    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);
  });

  describe('is locked', () => {
    beforeEach(() => {
      mockLock = MOCK_LOCK; // locked
    });

    it('should throw a ServiceUnavailableError if a Case is currently locked', async () => {
      await expect(
        updateTrialSessionInteractor(applicationContext, mockRequest),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getPersistenceGateway().updateCaseAndAssociations,
      ).not.toHaveBeenCalled();
    });

    it('should return a "retry_async_request" notification with the original request', async () => {
      await expect(
        updateTrialSessionInteractor(applicationContext, mockRequest),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getNotificationGateway().sendNotificationToUser,
      ).toHaveBeenCalledWith({
        applicationContext,
        message: {
          action: 'retry_async_request',
          originalRequest: mockRequest,
          requestToRetry: 'update_trial_session',
        },
        userId: docketClerkUser.userId,
      });

      expect(
        applicationContext.getPersistenceGateway().getCaseByDocketNumber,
      ).not.toHaveBeenCalled();
    });
  });

  describe('is not locked', () => {
    beforeEach(() => {
      mockLock = undefined; // unlocked
    });

    it('should acquire a lock that lasts for 15 minutes', async () => {
      await updateTrialSessionInteractor(applicationContext, mockRequest);

      MOCK_TRIAL_INPERSON.caseOrder!.forEach(({ docketNumber }) => {
        expect(
          applicationContext.getPersistenceGateway().createLock,
        ).toHaveBeenCalledWith({
          applicationContext,
          identifier: `case|${docketNumber}`,
          ttl: 900,
        });
      });
    });

    it('should remove the lock', async () => {
      await updateTrialSessionInteractor(applicationContext, mockRequest);

      let expectedIdentifiers = MOCK_TRIAL_INPERSON.caseOrder!.map(
        ({ docketNumber }) => `case|${docketNumber}`,
      );
      expectedIdentifiers.unshift(
        `trial-session|${mockRequest.trialSession.trialSessionId}`,
      );
      expect(
        applicationContext.getPersistenceGateway().removeLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifiers: expectedIdentifiers,
      });
    });
  });
});
