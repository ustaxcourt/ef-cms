import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_LOCK } from '../../../test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import {
  addPaperFilingInteractor,
  determineEntitiesToLock,
  handleLockError,
} from './addPaperFilingInteractor';
import { applicationContext } from '../../test/createTestApplicationContext';
import { docketClerkUser } from '../../../test/mockUsers';

describe('determineEntitiesToLock', () => {
  let mockParams;
  beforeEach(() => {
    mockParams = {
      applicationContext,
      consolidatedGroupDocketNumbers: [],
      documentMetadata: {
        docketNumber: MOCK_CASE.docketNumber,
      },
    };
  });
  it('should return an object that includes the subjectCaseDocketNumber in the identifiers', () => {
    mockParams.documentMetadata.docketNumber = '123-20';
    expect(
      determineEntitiesToLock(applicationContext, mockParams).identifiers,
    ).toContain('case|123-20');
  });
  it('should return an object that includes all of the docketNumbers specified in the identifiers', () => {
    mockParams.consolidatedGroupDocketNumbers = ['111-20', '222-20', '333-20'];
    expect(
      determineEntitiesToLock(applicationContext, mockParams).identifiers,
    ).toContain('case|111-20');
    expect(
      determineEntitiesToLock(applicationContext, mockParams).identifiers,
    ).toContain('case|222-20');
    expect(
      determineEntitiesToLock(applicationContext, mockParams).identifiers,
    ).toContain('case|333-20');
  });
});

describe('handleLockError', () => {
  const mockClientConnectionId = '987654';

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);
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
      requestToRetry: 'add_paper_filing',
    });
  });
});

describe('addPaperFilingInteractor', () => {
  const mockClientConnectionId = '987654';
  const mockCase = { ...MOCK_CASE, leadDocketNumber: MOCK_CASE.docketNumber };
  let mockLock;
  const mockRequest = {
    clientConnectionId: mockClientConnectionId,
    consolidatedGroupDocketNumbers: [],
    docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    documentMetadata: {
      docketNumber: MOCK_CASE.docketNumber,
      documentTitle: 'Memorandum in Support',
      documentType: 'Memorandum in Support',
      eventCode: 'MISP',
      filedBy: 'Test Petitioner',
      isFileAttached: true,
      isPaper: true,
    },
    isSavingForLater: true,
  };

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined; // unlocked
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);
  });

  describe('locked', () => {
    beforeEach(() => {
      mockLock = MOCK_LOCK;
    });

    it('should throw a ServiceUnavailableError if a Case is currently locked', async () => {
      await expect(
        addPaperFilingInteractor(applicationContext, mockRequest),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getPersistenceGateway().getCaseByDocketNumber,
      ).not.toHaveBeenCalled();
    });

    it('should return a "retry_async_request" notification with the original request', async () => {
      await expect(
        addPaperFilingInteractor(applicationContext, mockRequest),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getNotificationGateway().sendNotificationToUser,
      ).toHaveBeenCalledWith({
        applicationContext,
        clientConnectionId: mockClientConnectionId,
        message: {
          action: 'retry_async_request',
          originalRequest: mockRequest,
          requestToRetry: 'add_paper_filing',
        },
        userId: docketClerkUser.userId,
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
      await addPaperFilingInteractor(applicationContext, mockRequest);

      expect(
        applicationContext.getPersistenceGateway().createLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifier: `case|${mockCase.docketNumber}`,
        ttl: 900,
      });
    });
    it('should remove the lock', async () => {
      await addPaperFilingInteractor(applicationContext, mockRequest);

      expect(
        applicationContext.getPersistenceGateway().removeLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifiers: [`case|${mockCase.docketNumber}`],
      });
    });
  });
});
