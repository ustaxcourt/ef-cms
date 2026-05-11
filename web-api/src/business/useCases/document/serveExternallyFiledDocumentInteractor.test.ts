import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/docketEntry/fileAndServeDocumentOnOneCase',
);
jest.mock(
  '@web-api/persistence/postgres/docketEntries/updateDocketEntryPendingServiceStatus',
);
// The qpdf wrapper shells out to a binary; we never exercise that in unit
// tests. qpdfPageCount returns a fixed page count.
jest.mock('@web-api/utilities/qpdf', () => ({
  qpdfMerge: jest.fn().mockResolvedValue(undefined),
  qpdfPageCount: jest.fn().mockResolvedValue(939),
}));
// Mock the qpdf-based serve helpers at the module boundary. The interactor's
// responsibility is to call them with the right inputs; their internals are
// covered by serveDocumentWithQpdf.test.ts.
jest.mock(
  '@web-api/business/useCaseHelper/document/serveDocumentWithQpdf',
  () => ({
    prependCoversheetWithQpdfAndPersist: jest
      .fn()
      .mockResolvedValue({ withCoverPath: '/tmp/serve-mock/with-cover.pdf', numberOfPages: 940 }),
    runPaperServiceWithQpdf: jest
      .fn()
      .mockResolvedValue({ pdfUrl: 'ayo.seankingston.com' }),
  }),
);
import {
  DOCUMENT_SERVED_MESSAGES,
  SIMULTANEOUS_DOCUMENT_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { serveExternallyFiledDocumentInteractor } from './serveExternallyFiledDocumentInteractor';
import { MOCK_CASE } from '@shared/test/mockCase';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { docketClerkUser } from '@shared/test/mockUsers';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { fileAndServeDocumentOnOneCase as fileAndServeDocumentOnOneCaseMock } from '@web-api/business/useCaseHelper/docketEntry/fileAndServeDocumentOnOneCase';
import { updateDocketEntryPendingServiceStatus as updateDocketEntryPendingServiceStatusMock } from '@web-api/persistence/postgres/docketEntries/updateDocketEntryPendingServiceStatus';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';
import {
  prependCoversheetWithQpdfAndPersist as prependCoversheetWithQpdfAndPersistMock,
  runPaperServiceWithQpdf as runPaperServiceWithQpdfMock,
} from '@web-api/business/useCaseHelper/document/serveDocumentWithQpdf';
import { qpdfPageCount as qpdfPageCountMock } from '@web-api/utilities/qpdf';

const getUserById = jest.mocked(getUserByIdMock);
const prependCoversheetWithQpdfAndPersist = jest.mocked(
  prependCoversheetWithQpdfAndPersistMock,
);
const runPaperServiceWithQpdf = jest.mocked(runPaperServiceWithQpdfMock);
const qpdfPageCount = jest.mocked(qpdfPageCountMock);

describe('serveExternallyFiledDocumentInteractor', () => {
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
  let mockCase: RawCase;
  const fileAndServeDocumentOnOneCase = jest.mocked(
    fileAndServeDocumentOnOneCaseMock,
  );
  const updateDocketEntryPendingServiceStatus = jest.mocked(
    updateDocketEntryPendingServiceStatusMock,
  );

  const mockClientConnectionId = '987654';
  const mockDocketEntryId = '225d5474-b02b-4137-a78e-2043f7a0f806';
  const mockDocumentStorageId = '970a7d2c-c631-444a-9c05-3fdee7148085';
  const mockNumberOfPages = 939;
  const mockPdfUrl = 'ayo.seankingston.com';

  beforeAll(() => {
    qpdfPageCount.mockResolvedValue(mockNumberOfPages);
  });

  beforeEach(() => {
    mockCase = {
      ...MOCK_CASE,
      docketEntries: [
        {
          docketEntryId: mockDocketEntryId,
          documentStorageId: mockDocumentStorageId,
          documentTitle: 'something cool',
        } as RawDocketEntry,
      ],
    };
    getCaseByDocketNumber.mockResolvedValue(mockCase);
    getCasesByDocketNumbers.mockResolvedValue([mockCase]);

    getUserById.mockResolvedValue(docketClerkUser as DbUser);

    fileAndServeDocumentOnOneCase.mockImplementation(
      ({ caseEntity }) => caseEntity,
    );

    prependCoversheetWithQpdfAndPersist.mockResolvedValue({
      withCoverPath: '/tmp/serve-mock/with-cover.pdf',
      numberOfPages: mockNumberOfPages + 1,
    });
    runPaperServiceWithQpdf.mockResolvedValue({ pdfUrl: mockPdfUrl });
  });

  it('should throw an error when the user is not authorized to serve externally filed documents', async () => {
    await expect(
      serveExternallyFiledDocumentInteractor(
        applicationContext,
        {
          clientConnectionId: mockClientConnectionId,
          docketEntryId: '',
          docketNumbers: [],
          subjectCaseDocketNumber: '',
        },
        {} as UnknownAuthUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when the docket entry is not found on the subject case', async () => {
    const mockNonExistentDocketEntryId = 'd9f645b1-c0b6-4782-a798-091760343573';

    await expect(
      serveExternallyFiledDocumentInteractor(
        applicationContext,
        {
          clientConnectionId: '',
          docketEntryId: mockNonExistentDocketEntryId,
          docketNumbers: [],
          subjectCaseDocketNumber: '',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Docket entry not found');
  });

  it('should throw an error when the docket entry has already been served', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...mockCase,
      docketEntries: [
        {
          docketEntryId: mockDocketEntryId,
          servedAt: '2018-03-01T05:00:00.000Z',
        } as RawDocketEntry,
      ],
    });

    await expect(
      serveExternallyFiledDocumentInteractor(
        applicationContext,
        {
          clientConnectionId: '',
          docketEntryId: mockDocketEntryId,
          docketNumbers: [],
          subjectCaseDocketNumber: '',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Docket entry has already been served');
  });

  it('should throw an error when the docket entry is already pending service', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...mockCase,
      docketEntries: [
        {
          docketEntryId: mockDocketEntryId,
          isPendingService: true,
        } as RawDocketEntry,
      ],
    });

    await expect(
      serveExternallyFiledDocumentInteractor(
        applicationContext,
        {
          clientConnectionId: '',
          docketEntryId: mockDocketEntryId,
          docketNumbers: [],
          subjectCaseDocketNumber: '',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Docket entry is already being served');

    expect(runPaperServiceWithQpdf).not.toHaveBeenCalled();
  });

  it('should set the docket entry`s draftOrderState to null', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...mockCase,
      docketEntries: [
        {
          docketEntryId: mockDocketEntryId,
          documentTitle: 'fake title',
          draftOrderState: {},
        } as RawDocketEntry,
      ],
    });

    await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(
      fileAndServeDocumentOnOneCase.mock.calls[0][0].docketEntryEntity
        .draftOrderState,
    ).toBeNull();
  });

  it('should set the docket entry`s filing date to today when the document is not a simultaneous document type', async () => {
    const mockToday = '2018-03-01T05:00:00.000Z';
    applicationContext
      .getUtilities()
      .createISODateString.mockReturnValue(mockToday);

    getCaseByDocketNumber.mockResolvedValueOnce({
      ...mockCase,
      docketEntries: [
        {
          docketEntryId: mockDocketEntryId,
          documentTitle: 'fake title',
          eventCode: 'A',
          filingDate: 'abc',
        } as RawDocketEntry,
      ],
    });

    await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(
      fileAndServeDocumentOnOneCase.mock.calls[0][0].docketEntryEntity
        .filingDate,
    ).toBe(mockToday);
  });

  it('should retain the docket entry`s filing date when the document is a simultaneous document type', async () => {
    const mockOriginalFilingDate = '1993/02/05';

    getCaseByDocketNumber.mockResolvedValue({
      ...mockCase,
      docketEntries: [
        {
          docketEntryId: mockDocketEntryId,
          eventCode: SIMULTANEOUS_DOCUMENT_EVENT_CODES[0],
          filingDate: mockOriginalFilingDate,
        } as RawDocketEntry,
      ],
    });

    await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(
      fileAndServeDocumentOnOneCase.mock.calls[0][0].docketEntryEntity
        .filingDate,
    ).toBe(mockOriginalFilingDate);
  });

  it('should mark the docket entry as NOT a draft', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...mockCase,
      docketEntries: [
        {
          docketEntryId: mockDocketEntryId,
          documentTitle: 'fake title',
          isDraft: true,
        } as RawDocketEntry,
      ],
    });

    await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(
      fileAndServeDocumentOnOneCase.mock.calls[0][0].docketEntryEntity.isDraft,
    ).toBe(false);
  });

  it('should set isFileAttached to true on the docket entry', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...mockCase,
      docketEntries: [
        {
          docketEntryId: mockDocketEntryId,
          documentTitle: 'fake title',
          isFileAttached: false,
        } as RawDocketEntry,
      ],
    });

    await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(
      fileAndServeDocumentOnOneCase.mock.calls[0][0].docketEntryEntity
        .isFileAttached,
    ).toBe(true);
  });

  it('should mark the docket entry as on the docket record', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...mockCase,
      docketEntries: [
        {
          docketEntryId: mockDocketEntryId,
          documentTitle: 'fake title',
          isOnDocketRecord: false,
        } as RawDocketEntry,
      ],
    });

    await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(
      fileAndServeDocumentOnOneCase.mock.calls[0][0].docketEntryEntity
        .isOnDocketRecord,
    ).toBe(true);
  });

  it('should set the number of pages in the docket entry from qpdfPageCount of the original PDF on /tmp', async () => {
    await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(
      fileAndServeDocumentOnOneCase.mock.calls[0][0].docketEntryEntity
        .numberOfPages,
    ).toBe(mockNumberOfPages);

    // qpdfPageCount is called with the staged /tmp path to orig.pdf — we
    // assert that the path ends in /orig.pdf rather than baking in the
    // exact tmpdir name (which varies per invocation).
    expect(qpdfPageCount.mock.calls[0][0]).toMatch(/[\\/]orig\.pdf$/);
  });

  it('should only serve the docket entry on the subjectCase when the subject docket entry is a simultaneous document type', async () => {
    const mockMemberCaseDocketNumber = '999-15';

    getCaseByDocketNumber.mockResolvedValue({
      ...mockCase,
      docketEntries: [
        {
          docketEntryId: mockDocketEntryId,
          documentTitle: 'fake title',
          eventCode: SIMULTANEOUS_DOCUMENT_EVENT_CODES[0],
        } as RawDocketEntry,
      ],
    });

    await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [mockMemberCaseDocketNumber],
        subjectCaseDocketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(fileAndServeDocumentOnOneCase).toHaveBeenCalledTimes(1);
    expect(
      fileAndServeDocumentOnOneCase.mock.calls[0][0].caseEntity.docketNumber,
    ).toBe(mockCase.docketNumber);
  });

  it('should only serve the docket entry on the subjectCase when the subject docket entry has a simultaneous document title', async () => {
    const mockMemberCaseDocketNumber = '999-15';

    getCaseByDocketNumber.mockResolvedValue({
      ...mockCase,
      docketEntries: [
        {
          docketEntryId: mockDocketEntryId,
          documentTitle: 'Simultaneous doc title',
        } as RawDocketEntry,
      ],
    });

    await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [mockMemberCaseDocketNumber],
        subjectCaseDocketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(fileAndServeDocumentOnOneCase).toHaveBeenCalledTimes(1);
    expect(
      fileAndServeDocumentOnOneCase.mock.calls[0][0].caseEntity.docketNumber,
    ).toBe(mockCase.docketNumber);
  });

  it('should prepend a coversheet to the docket entry via the qpdf-based helper', async () => {
    getCaseByDocketNumber
      .mockResolvedValueOnce(mockCase)
      .mockResolvedValueOnce({
        ...mockCase,
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            documentTitle: 'fake title',
          } as RawDocketEntry,
        ],
      });

    await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(prependCoversheetWithQpdfAndPersist).toHaveBeenCalledTimes(1);
    expect(prependCoversheetWithQpdfAndPersist.mock.calls[0][0]).toMatchObject({
      documentStorageId: mockDocumentStorageId,
    });
  });

  it('should set isPendingService to truthy when filing the subject docket entry', async () => {
    const memberCaseDocketNumber = '999-16';

    getCaseByDocketNumber.mockResolvedValueOnce(mockCase);

    getCasesByDocketNumbers.mockResolvedValueOnce([
      mockCase,
      { ...mockCase, docketNumber: memberCaseDocketNumber },
    ]);

    await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [memberCaseDocketNumber],
        subjectCaseDocketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(
      fileAndServeDocumentOnOneCase.mock.calls[0][0].docketEntryEntity
        .isPendingService,
    ).toBeTruthy();

    expect(
      fileAndServeDocumentOnOneCase.mock.calls[1][0].docketEntryEntity
        .isPendingService,
    ).toBeFalsy();
  });

  it('should call the persistence method to set and unset the pending service status on the subjectCase`s docket entry ONLY', async () => {
    const memberCaseDocketNumber = '999-16';

    await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [memberCaseDocketNumber],
        subjectCaseDocketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(updateDocketEntryPendingServiceStatus).toHaveBeenCalledTimes(2);
    expect(updateDocketEntryPendingServiceStatus).toHaveBeenCalledWith({
      docketEntryId: mockDocketEntryId,
      docketNumber: mockCase.docketNumber,
      status: true,
    });
    expect(updateDocketEntryPendingServiceStatus).toHaveBeenCalledWith({
      docketEntryId: mockDocketEntryId,
      docketNumber: mockCase.docketNumber,
      status: false,
    });
  });

  it('should reset the docketEntry pending service status to false when an error occurs while serving', async () => {
    const mockErrorText = 'whoops, that is an error!';
    runPaperServiceWithQpdf.mockRejectedValueOnce(new Error(mockErrorText));

    await expect(
      serveExternallyFiledDocumentInteractor(
        applicationContext,
        {
          clientConnectionId: '',
          docketEntryId: mockDocketEntryId,
          docketNumbers: [],
          subjectCaseDocketNumber: mockCase.docketNumber,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(mockErrorText);

    expect(updateDocketEntryPendingServiceStatus).toHaveBeenCalledTimes(2);
    expect(
      updateDocketEntryPendingServiceStatus.mock.calls[0][0],
    ).toMatchObject({
      docketEntryId: mockDocketEntryId,
      docketNumber: mockCase.docketNumber,
      status: true,
    });
    expect(
      updateDocketEntryPendingServiceStatus.mock.calls[1][0],
    ).toMatchObject({
      docketEntryId: mockDocketEntryId,
      docketNumber: mockCase.docketNumber,
      status: false,
    });
  });

  it('should call runPaperServiceWithQpdf to generate a paper service pdf', async () => {
    await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: '',
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(runPaperServiceWithQpdf.mock.calls[0][0]).toMatchObject({
      docketEntryId: mockDocketEntryId,
    });
  });

  it('should send a serve_document_complete notification to the user', async () => {
    await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].clientConnectionId,
    ).toBe(mockClientConnectionId);
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.action,
    ).toBe('serve_document_complete');
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].userId,
    ).toBe(docketClerkUser.userId);
  });

  it('should send a notification including the DOCUMENT_SERVED_MESSAGES.SELECTED_CASES message when the docket entry was served on more than one case', async () => {
    await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        docketEntryId: mockDocketEntryId,
        docketNumbers: ['102-34'],
        subjectCaseDocketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.alertSuccess.message,
    ).toBe(DOCUMENT_SERVED_MESSAGES.SELECTED_CASES);
  });

  it('should send a notification including the DOCUMENT_SERVED_MESSAGES.ENTRY_ADDED message when the docket entry was served on exactly one case', async () => {
    await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.alertSuccess.message,
    ).toBe(DOCUMENT_SERVED_MESSAGES.ENTRY_ADDED);
  });

  it('should send a notification with a paper service url when at least one of the served cases has paper service parties', async () => {
    await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.pdfUrl,
    ).toBe(mockPdfUrl);
  });

  it('should send a serve_document_complete notification WITHOUT a paper service url when none of the served cases have paper service parties', async () => {
    runPaperServiceWithQpdf.mockResolvedValueOnce({ pdfUrl: undefined });

    await serveExternallyFiledDocumentInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        docketEntryId: mockDocketEntryId,
        docketNumbers: [],
        subjectCaseDocketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.pdfUrl,
    ).toBeUndefined();
  });
});
