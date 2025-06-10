import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock('../addCoverToPdf');
jest.mock(
  '@web-api/business/useCaseHelper/docketEntry/fileAndServeDocumentOnOneCase',
);
import { MOCK_CASE } from '@shared/test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { addCoverToPdf } from '../addCoverToPdf';
import {
  determineEntitiesToLock,
  serveExternallyFiledDocumentInteractor,
} from '@web-api/business/useCases/document/serveExternallyFiledDocumentInteractor';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { testPdfDoc } from '@shared/business/test/getFakeFile';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { fileAndServeDocumentOnOneCase as fileAndServeDocumentOnOneCaseMock } from '@web-api/business/useCaseHelper/docketEntry/fileAndServeDocumentOnOneCase';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { tryGetLock as tryGetLockMock } from '@web-api/persistence/postgres/utils/operation/tryGetLock';
import { releaseLock as releaseLockMock } from '@web-api/persistence/postgres/utils/operation/releaseLock';
import { hashLockId } from '@web-api/persistence/postgres/utils/mutex';

const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
const tryGetLock = jest.mocked(tryGetLockMock);
const releaseLock = jest.mocked(releaseLockMock);

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
  const mockRequest = {
    clientConnectionId: mockClientConnectionId,
    docketEntryId: mockDocketEntryId,
    docketNumbers: [],
    subjectCaseDocketNumber: mockCase.docketNumber,
  };
  const fileAndServeDocumentOnOneCase = jest.mocked(
    fileAndServeDocumentOnOneCaseMock,
  );

  beforeAll(() => {
    (addCoverToPdf as jest.Mock).mockResolvedValue({
      pdfData: testPdfDoc,
    });
  });

  beforeEach(() => {
    fileAndServeDocumentOnOneCase.mockImplementation(
      ({ caseEntity }) => caseEntity,
    );

    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(mockDocketClerkUser);

    getCaseByDocketNumber.mockResolvedValue(mockCase);
    getCasesByDocketNumbers.mockResolvedValue([mockCase]);
  });

  describe('locked', () => {
    beforeEach(() => {
      tryGetLock.mockResolvedValue(false);
    });

    it('should throw a ServiceUnavailableError if a Case is currently locked', async () => {
      await expect(
        serveExternallyFiledDocumentInteractor(
          applicationContext,
          mockRequest,
          mockDocketClerkUser,
        ),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(getCaseByDocketNumber).not.toHaveBeenCalled();
    });
  });

  describe('not locked', () => {
    beforeEach(() => {
      tryGetLock.mockResolvedValue(true);
    });

    it('should acquire a lock that lasts for 15 minutes', async () => {
      await serveExternallyFiledDocumentInteractor(
        applicationContext,
        mockRequest,
        mockDocketClerkUser,
      );

      expect(tryGetLock.mock.calls[0][1]).toEqual(
        hashLockId(`case|${mockCase.docketNumber}`),
      );
    });

    it('should remove the lock', async () => {
      await serveExternallyFiledDocumentInteractor(
        applicationContext,
        mockRequest,
        mockDocketClerkUser,
      );

      expect(releaseLock.mock.calls[0][1]).toEqual(
        hashLockId(`case|${mockCase.docketNumber}`),
      );
    });
  });
});
