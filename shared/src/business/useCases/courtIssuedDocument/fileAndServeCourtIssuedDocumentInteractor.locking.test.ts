import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_LOCK } from '../../../test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import {
  determineEntitiesToLock,
  fileAndServeCourtIssuedDocumentInteractor,
  handleLockError,
} from './fileAndServeCourtIssuedDocumentInteractor';
import { docketClerkUser } from '../../../test/mockUsers';

describe('determineEntitiesToLock', () => {
  let mockParams;
  beforeEach(() => {
    mockParams = {
      applicationContext,
      docketNumbers: [],
      subjectCaseDocketNumber: '123-20',
    };
  });

  it('should return an object that includes the documentMetadata.docketNumber in the identifiers', () => {
    mockParams.subjectCaseDocketNumber = '123-20';
    expect(
      determineEntitiesToLock(applicationContext, mockParams).identifiers,
    ).toContain('case|123-20');
  });

  it('should return an object that includes all of the consolidatedGroupDocketNumbers specified in the identifiers', () => {
    mockParams.docketNumbers = ['111-20', '222-20', '333-20'];
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
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);
  });

  it('should determine who the user is based on applicationContext', async () => {
    await handleLockError(applicationContext, { foo: 'bar' });
    expect(applicationContext.getCurrentUser).toHaveBeenCalled();
  });

  it('should send a notification to the user with "retry_file_and_serve_court_issued_document" and the originalRequest', async () => {
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
      requestToRetry: 'file_and_serve_court_issued_document',
    });
  });
});

describe('fileAndServeCourtIssuedDocumentInteractor', () => {
  const mockClientConnectionId = '2810-happydoo';
  const mockDocketEntryId = '50107716-6d08-4693-bfd5-a07a4e6eadce';
  const mockCase = {
    ...MOCK_CASE,
    docketEntries: [
      ...MOCK_CASE.docketEntries,
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
        documentType: 'Notice',
        eventCode: 'ODJ',
        isDraft: true,
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: docketClerkUser.userId,
        signedJudgeName: 'Judge Dredd',
        userId: docketClerkUser.userId,
      },
    ],
  };
  let mockRequest;
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => mockCase);
  });

  beforeEach(() => {
    mockRequest = {
      clientConnectionId: mockClientConnectionId,
      docketEntryId: mockDocketEntryId,
      docketNumbers: [],
      form: {
        ...MOCK_CASE.docketEntries[0],
        documentType: 'Notice',
        eventCode: 'ODJ',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedJudgeName: 'Judge Dredd',
      },
      subjectCaseDocketNumber: MOCK_CASE.docketNumber,
    };
  });

  describe('is locked', () => {
    beforeEach(() => {
      mockLock = MOCK_LOCK; // locked
    });

    it('should throw a ServiceUnavailableError if a Case is currently locked', async () => {
      await expect(
        fileAndServeCourtIssuedDocumentInteractor(
          applicationContext,
          mockRequest,
        ),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getPersistenceGateway().getCaseByDocketNumber,
      ).not.toHaveBeenCalled();
    });

    it('should return a "retry_async_request" notification with the original request', async () => {
      await expect(
        fileAndServeCourtIssuedDocumentInteractor(
          applicationContext,
          mockRequest,
        ),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getNotificationGateway().sendNotificationToUser,
      ).toHaveBeenCalledWith({
        applicationContext,
        clientConnectionId: mockClientConnectionId,
        message: {
          action: 'retry_async_request',
          originalRequest: mockRequest,
          requestToRetry: 'file_and_serve_court_issued_document',
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
      await fileAndServeCourtIssuedDocumentInteractor(
        applicationContext,
        mockRequest,
      );

      expect(
        applicationContext.getPersistenceGateway().createLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifier: `case|${MOCK_CASE.docketNumber}`,
        ttl: 900,
      });

      expect(
        applicationContext.getPersistenceGateway().removeLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      });
    });

    it('should remove the lock', async () => {
      await fileAndServeCourtIssuedDocumentInteractor(
        applicationContext,
        mockRequest,
      );
      expect(
        applicationContext.getPersistenceGateway().removeLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      });
    });
  });
});
