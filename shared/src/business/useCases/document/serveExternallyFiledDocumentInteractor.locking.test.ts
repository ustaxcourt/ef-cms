import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_LOCK } from '../../../test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
jest.mock('../addCoverToPdf');
import { addCoverToPdf } from '../addCoverToPdf';
import {
  determineEntitiesToLock,
  handleLockError,
  serveExternallyFiledDocumentInteractor,
} from './serveExternallyFiledDocumentInteractor';
import { docketClerkUser } from '../../../test/mockUsers';
import { testPdfDoc } from '../../test/getFakeFile';

describe('determineEntitiesToLock', () => {
  let mockParams;
  beforeEach(() => {
    mockParams = {
      applicationContext,
      docketNumbers: [],
      subjectCaseDocketNumber: MOCK_CASE.docketNumber,
    };
  });

  it('should return an object that includes the subjectCaseDocketNumber in the identifiers', () => {
    mockParams.subjectCaseDocketNumber = '123-20';
    expect(
      determineEntitiesToLock(applicationContext, mockParams).identifiers,
    ).toContain('case|123-20');
  });

  it('should return an object that includes all of the docketNumbers specified in the identifiers', () => {
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
      requestToRetry: 'serve_externally_filed_document',
    });
  });
});

describe('serveExternallyFiledDocumentInteractor', () => {
  const mockClientConnectionId = '987654';
  const mockDocketEntryId = '225d5474-b02b-4137-a78e-2043f7a0f806';
  const mockPdfUrl = 'ayo.seankingston.com';
  const mockCase = {
    ...MOCK_CASE,
    docketEntries: [
      { docketEntryId: mockDocketEntryId, isOnDocketRecord: false },
    ],
  };
  let mockLock;
  const mockRequest = {
    clientConnectionId: mockClientConnectionId,
    docketEntryId: mockDocketEntryId,
    docketNumbers: [],
    subjectCaseDocketNumber: mockCase.docketNumber,
  };

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
    (addCoverToPdf as jest.Mock).mockResolvedValue({
      pdfData: testPdfDoc,
    });
  });

  beforeEach(() => {
    mockLock = undefined; // unlocked
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    applicationContext
      .getUseCaseHelpers()
      .fileAndServeDocumentOnOneCase.mockImplementation(
        ({ caseEntity }) => caseEntity,
      );

    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });

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
        serveExternallyFiledDocumentInteractor(applicationContext, mockRequest),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getPersistenceGateway().getCaseByDocketNumber,
      ).not.toHaveBeenCalled();
    });

    it('should return a "retry_async_request" notification with the original request', async () => {
      await expect(
        serveExternallyFiledDocumentInteractor(applicationContext, mockRequest),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getNotificationGateway().sendNotificationToUser,
      ).toHaveBeenCalledWith({
        applicationContext,
        clientConnectionId: mockClientConnectionId,
        message: {
          action: 'retry_async_request',
          originalRequest: mockRequest,
          requestToRetry: 'serve_externally_filed_document',
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
      await serveExternallyFiledDocumentInteractor(
        applicationContext,
        mockRequest,
      );

      expect(
        applicationContext.getPersistenceGateway().createLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifier: `case|${mockCase.docketNumber}`,
        ttl: 900,
      });
    });

    it('should remove the lock', async () => {
      await serveExternallyFiledDocumentInteractor(
        applicationContext,
        mockRequest,
      );

      expect(
        applicationContext.getPersistenceGateway().removeLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifiers: [`case|${mockCase.docketNumber}`],
      });
    });
  });
});
