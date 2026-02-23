import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/docketEntry/addDocketEntryToCase',
);
jest.mock('@shared/sharedAppContext');
import {
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import {
  MOCK_CASE,
  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
  MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} from '@shared/test/mockCase';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { addPaperFilingInteractor } from './addPaperFilingInteractor';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { docketClerkUser } from '@shared/test/mockUsers';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { upsertWorkItems as upsertWorkItemsMock } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { addDocketEntryToCase as addDocketEntrytoCaseMock } from '@web-api/business/useCaseHelper/docketEntry/addDocketEntryToCase';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { getUniqueId as getUniqueIdMock } from '@shared/sharedAppContext';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

const getUserById = jest.mocked(getUserByIdMock);

describe('addPaperFilingInteractor', () => {
  const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
  const addDocketEntryToCase = jest.mocked(addDocketEntrytoCaseMock);
  addDocketEntryToCase.mockResolvedValue(undefined);
  const getUniqueId = jest.mocked(getUniqueIdMock);
  const upsertWorkItems = upsertWorkItemsMock as jest.Mock;
  const mockClientConnectionId = '987654';
  const mockCase = { ...MOCK_CASE, leadDocketNumber: MOCK_CASE.docketNumber };
  let defaultParameters: {
    clientConnectionId: string;
    consolidatedGroupDocketNumbers: string[];
    documentMetadata: any;
    isSavingForLater: boolean;
    documentStorageId: string;
  };

  beforeEach(() => {
    defaultParameters = {
      clientConnectionId: '1234',
      consolidatedGroupDocketNumbers: ['101-23', '300-23'],
      documentStorageId: '101',
      documentMetadata: {
        docketNumber: mockCase.docketNumber,
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filedBy: 'Test Petitioner',
        isFileAttached: true,
        isPaper: true,
      },
      isSavingForLater: false,
    };

    getUserById.mockResolvedValue(docketClerkUser as DbUser);
    getUniqueId.mockReturnValue('67595d6a-e161-4096-8241-ae89bab7e631');
    getCasesByDocketNumbers.mockResolvedValue([mockCase]);
  });

  it('should throw an error when the user is not authorized to add a paper filing', async () => {
    await expect(
      addPaperFilingInteractor(
        applicationContext,
        defaultParameters,
        {} as UnknownAuthUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should generate a new documentStorageId when one is not provided', async () => {
    defaultParameters.documentStorageId = undefined as any;

    await addPaperFilingInteractor(
      applicationContext,
      defaultParameters,
      mockDocketClerkUser,
    );

    expect(getUniqueId).toHaveBeenCalled();
  });

  it('should throw an error when the documentMetadata is not provided', async () => {
    defaultParameters.documentMetadata = undefined as any;

    await expect(
      addPaperFilingInteractor(
        applicationContext,
        defaultParameters,
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Did not receive meta data for docket entry');
  });

  it('should add documents and send service emails for electronic service parties using the passed in documentStorageId as docketEntryId for the newly created docketEntry', async () => {
    const mockDocumentStorageId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';

    await addPaperFilingInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        consolidatedGroupDocketNumbers: [],
        documentStorageId: mockDocumentStorageId,
        documentMetadata: {
          docketNumber: mockCase.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
          isFileAttached: true,
          isPaper: true,
        },
        isSavingForLater: false,
      },
      mockDocketClerkUser,
    );

    expect(upsertWorkItems).toHaveBeenCalled();
    expect(addDocketEntryToCase).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf
        .mock.calls[0][0].docketEntryId,
    ).toEqual(mockDocumentStorageId);
  });

  it('should return paper service url as part of the "serve_document_complete" message when the case has paper service parties', async () => {
    const mockPdfUrl = 'www.example.com';
    mockCase.petitioners[0].serviceIndicator = SERVICE_INDICATOR_TYPES.SI_PAPER;
    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });

    await addPaperFilingInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        consolidatedGroupDocketNumbers: [],
        documentStorageId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          docketNumber: mockCase.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
          isFileAttached: true,
          isPaper: true,
        },
        isSavingForLater: false,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.pdfUrl,
    ).toEqual(mockPdfUrl);
  });

  it('should return paper service url as part of the "serve_document_complete" message when the document is filed on a lead case and one of the member cases has a party with paper service', async () => {
    const mockPdfUrl = 'www.example.com';
    getCasesByDocketNumbers.mockResolvedValue([
      {
        ...(MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE as any),
        leadDocketNumber: mockCase.docketNumber,
      },
    ]);

    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });

    await addPaperFilingInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        consolidatedGroupDocketNumbers: [
          MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
        ],
        documentStorageId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          docketNumber: mockCase.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
          isFileAttached: true,
          isPaper: true,
        },
        isSavingForLater: false,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.pdfUrl,
    ).toEqual(mockPdfUrl);
  });

  it('should add documents and workItem to inbox when saving for later when a document is attached', async () => {
    await addPaperFilingInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        consolidatedGroupDocketNumbers: [],
        documentStorageId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          docketNumber: mockCase.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
          isFileAttached: true,
          isPaper: true,
        },
        isSavingForLater: true,
      },
      mockDocketClerkUser,
    );

    expect(upsertWorkItems.mock.calls[0][0].workItems).toMatchObject([
      {
        docketNumber: mockCase.docketNumber,
      },
    ]);
    expect(addDocketEntryToCase).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).toHaveBeenCalled();
  });

  it('should add documents and workItem to inbox when saving for later when a document is NOT attached', async () => {
    await addPaperFilingInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        consolidatedGroupDocketNumbers: [],
        documentStorageId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          docketNumber: mockCase.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
          isFileAttached: false,
          isPaper: true,
        },
        isSavingForLater: true,
      },
      mockDocketClerkUser,
    );

    expect(upsertWorkItems).toHaveBeenCalled();
    expect(addDocketEntryToCase).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).not.toHaveBeenCalled();
  });

  it('should add workItem to the user outbox when NOT saving for later if a document is attached', async () => {
    await addPaperFilingInteractor(
      applicationContext,
      {
        clientConnectionId: undefined as any,
        consolidatedGroupDocketNumbers: [],
        documentStorageId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          docketNumber: mockCase.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
          isFileAttached: true,
          isPaper: true,
        },
        isSavingForLater: false,
      },
      mockDocketClerkUser,
    );

    expect(upsertWorkItems).toHaveBeenCalled();
  });

  it('calls addDocketEntryToCase with the correct docket entry when filing a tracked document type', async () => {
    await addPaperFilingInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        consolidatedGroupDocketNumbers: [],
        documentStorageId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          category: 'Application',
          docketNumber: mockCase.docketNumber,
          documentTitle: 'Application for Examination Pursuant to Rule 73',
          documentType: 'Application for Examination Pursuant to Rule 73',
          eventCode: 'AFE',
          filedBy: 'Test Petitioner',
          isFileAttached: true,
          isPaper: true,
        },
        isSavingForLater: false,
      },
      mockDocketClerkUser,
    );

    expect(addDocketEntryToCase).toHaveBeenCalled();
    expect(
      addDocketEntryToCase.mock.calls[0][0].docketEntryEntity.eventCode,
    ).toBe('AFE');
  });

  it('does not send the service email if an error occurs while updating the case', async () => {
    addDocketEntryToCase.mockRejectedValueOnce(new Error('bad!'));

    await expect(
      addPaperFilingInteractor(
        applicationContext,
        {
          clientConnectionId: mockClientConnectionId,
          consolidatedGroupDocketNumbers: [],
          documentStorageId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentMetadata: {
            docketNumber: mockCase.docketNumber,
            documentTitle: 'Memorandum in Support',
            documentType: 'Memorandum in Support',
            eventCode: 'MISP',
            filedBy: 'Test Petitioner',
            isFileAttached: true,
            isPaper: true,
          },
          isSavingForLater: false,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(new Error('bad!'));

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).not.toHaveBeenCalled();
  });

  it('should send a serve_document_complete notification with a success message when all document processing has completed', async () => {
    await addPaperFilingInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        consolidatedGroupDocketNumbers: [],
        documentStorageId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          docketNumber: mockCase.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
          isFileAttached: true,
          isPaper: true,
        },
        isSavingForLater: true,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0],
    ).toMatchObject({
      applicationContext: expect.anything(),
      clientConnectionId: mockClientConnectionId,
      message: expect.objectContaining({
        action: 'serve_document_complete',
        alertSuccess: {
          message: 'Your entry has been added to the docket record.',
          overwritable: false,
        },
      }),
    });
  });

  it('should send a serve_document_complete notification with generateCoversheet true when the docket entry has a file attached and the user is NOT saving for later', async () => {
    await addPaperFilingInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        consolidatedGroupDocketNumbers: [],
        documentStorageId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          docketNumber: mockCase.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
          isFileAttached: true,
          isPaper: true,
        },
        isSavingForLater: false,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.generateCoversheet,
    ).toBe(true);
  });

  it('should send a serve_document_complete notification with generateCoversheet false when the docket entry does NOT have a file attached', async () => {
    await addPaperFilingInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        consolidatedGroupDocketNumbers: [],
        documentStorageId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          docketNumber: mockCase.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
          isFileAttached: false,
          isPaper: true,
        },
        isSavingForLater: true,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.generateCoversheet,
    ).toBe(false);
  });

  describe('consolidated groups', () => {
    let mockConsolidatedGroupRequest;

    beforeEach(() => {
      mockConsolidatedGroupRequest = {
        clientConnectionId: mockClientConnectionId,
        consolidatedGroupDocketNumbers: ['101-90'],
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
          isFileAttached: true,
          isPaper: true,
        },
        isSavingForLater: true,
      };
    });

    it('should create a work item and add it to the document qc in progress box when the docket entry is being saved for later', async () => {
      mockConsolidatedGroupRequest.isSavingForLater = true;
      mockConsolidatedGroupRequest.consolidatedGroupDocketNumbers = ['101-90'];

      await addPaperFilingInteractor(
        applicationContext,
        mockConsolidatedGroupRequest,
        mockDocketClerkUser,
      );

      expect(addDocketEntryToCase).toHaveBeenCalledTimes(1);
      expect(upsertWorkItems).toHaveBeenCalledTimes(1);
    });

    it('should still save only one copy of the document to s3', async () => {
      const mockConsolidatedGroup = [
        MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
        MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
      ];
      mockConsolidatedGroupRequest.isSavingForLater = false;
      mockConsolidatedGroupRequest.consolidatedGroupDocketNumbers =
        mockConsolidatedGroup;

      await addPaperFilingInteractor(
        applicationContext,
        mockConsolidatedGroupRequest,
        mockDocketClerkUser,
      );

      expect(
        applicationContext.getUseCaseHelpers()
          .serveDocumentAndGetPaperServicePdf,
      ).toHaveBeenCalledTimes(1);
    });
  });

  it('should pass in an empty array for electronicParties when calling "serveDocumentAndGetPaperServicePdf" when dealing with ATP docket entry', async () => {
    const mockDocumentStorageId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';

    await addPaperFilingInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        consolidatedGroupDocketNumbers: [],
        documentStorageId: mockDocumentStorageId,
        documentMetadata: {
          docketNumber: mockCase.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'ATP',
          filedBy: 'Test Petitioner',
          isFileAttached: true,
          isPaper: true,
        },
        isSavingForLater: false,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf
        .mock.calls[0][0].electronicParties,
    ).toEqual([]);
  });
});
