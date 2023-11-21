import {
  AUTOMATIC_BLOCKED_REASONS,
  SERVICE_INDICATOR_TYPES,
} from '../../entities/EntityConstants';
import { Case } from '../../entities/cases/Case';
import {
  MOCK_CASE,
  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
  MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} from '../../../test/mockCase';
import { addPaperFilingInteractor } from './addPaperFilingInteractor';
import { applicationContext } from '../../test/createTestApplicationContext';
import { docketClerkUser } from '../../../test/mockUsers';

describe('addPaperFilingInteractor', () => {
  const mockClientConnectionId = '987654';
  const mockCase = { ...MOCK_CASE, leadDocketNumber: MOCK_CASE.docketNumber };
  let defaultParamaters: {
    clientConnectionId: string;
    consolidatedGroupDocketNumbers: string[];
    documentMetadata: any;
    isSavingForLater: boolean;
    docketEntryId: string;
  };

  beforeEach(() => {
    defaultParamaters = {
      clientConnectionId: '1234',
      consolidatedGroupDocketNumbers: ['101-23', '300-23'],
      docketEntryId: '101-23',
      documentMetadata: {},
      isSavingForLater: false,
    };

    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);
  });

  it('should throw an error when the user is not authorized to add a paper filing', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      addPaperFilingInteractor(applicationContext, defaultParamaters),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when docketEntryId is not provided', async () => {
    defaultParamaters.docketEntryId = undefined as any;

    await expect(
      addPaperFilingInteractor(applicationContext, defaultParamaters),
    ).rejects.toThrow('Did not receive a docketEntryId');
  });

  it('should throw an error when the documentMetadata is not provided', async () => {
    defaultParamaters.documentMetadata = undefined as any;

    await expect(
      addPaperFilingInteractor(applicationContext, defaultParamaters),
    ).rejects.toThrow('Did not receive meta data for docket entry');
  });

  it('should add documents and send service emails for electronic service parties', async () => {
    const mockdocketEntryId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';

    await addPaperFilingInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      consolidatedGroupDocketNumbers: [],
      docketEntryId: mockdocketEntryId,
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
    });

    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf
        .mock.calls[0][0].docketEntryId,
    ).toEqual(mockdocketEntryId);
  });

  it('should return paper service url as part of the "serve_document_complete" message when the case has paper service parties', async () => {
    const mockPdfUrl = 'www.example.com';
    mockCase.petitioners[0].serviceIndicator = SERVICE_INDICATOR_TYPES.SI_PAPER;
    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });

    await addPaperFilingInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      consolidatedGroupDocketNumbers: [],
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.pdfUrl,
    ).toEqual(mockPdfUrl);
  });

  it('should return paper service url as part of the "serve_document_complete" message when the document is filed on a lead case and one of the member cases has a party with paper service', async () => {
    const mockPdfUrl = 'www.example.com';
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(mockCase)
      .mockReturnValueOnce({
        ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
        leadDocketNumber: mockCase.docketNumber,
      });

    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });

    await addPaperFilingInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      consolidatedGroupDocketNumbers: [
        MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
      ],
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.pdfUrl,
    ).toEqual(mockPdfUrl);
  });

  it('should add documents and workItem to inbox when saving for later when a document is attached', async () => {
    await addPaperFilingInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      consolidatedGroupDocketNumbers: [],
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    });

    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[0][0]
        .workItem,
    ).toMatchObject({ leadDocketNumber: mockCase.leadDocketNumber });
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).toHaveBeenCalled();
  });

  it('should add documents and workItem to inbox when saving for later when a document is NOT attached', async () => {
    await addPaperFilingInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      consolidatedGroupDocketNumbers: [],
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    });

    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).not.toHaveBeenCalled();
  });

  it('should add workItem to the user outbox when NOT saving for later if a document is attached', async () => {
    await addPaperFilingInteractor(applicationContext, {
      clientConnectionId: undefined as any,
      consolidatedGroupDocketNumbers: [],
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    });

    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox.mock
        .calls[0][0].userId,
    ).toEqual(docketClerkUser.userId);
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
  });

  it('sets the case as blocked if the document filed is a tracked document type', async () => {
    await addPaperFilingInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      consolidatedGroupDocketNumbers: [],
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('sets the case as blocked with due dates if the document filed is a tracked document type and the case has due dates', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockReturnValue([
        { deadline: 'something' },
      ]);

    await addPaperFilingInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      consolidatedGroupDocketNumbers: [],
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('does not send the service email if an error occurs while updating the case', async () => {
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockRejectedValueOnce(new Error('bad!'));

    await expect(
      addPaperFilingInteractor(applicationContext, {
        clientConnectionId: mockClientConnectionId,
        consolidatedGroupDocketNumbers: [],
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
      }),
    ).rejects.toThrow(new Error('bad!'));

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).not.toHaveBeenCalled();
  });

  it('should use original case caption to create case title when creating work item', async () => {
    await addPaperFilingInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      consolidatedGroupDocketNumbers: [],
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[0][0]
        .workItem,
    ).toMatchObject({
      caseTitle: Case.getCaseTitle(mockCase.caseCaption),
    });
  });

  it('should send a serve_document_complete notification with a success message when all document processing has completed', async () => {
    await addPaperFilingInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      consolidatedGroupDocketNumbers: [],
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    });

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
    await addPaperFilingInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      consolidatedGroupDocketNumbers: [],
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.generateCoversheet,
    ).toBe(true);
  });

  it('should send a serve_document_complete notification with generateCoversheet false when the docket entry does NOT have a file attached', async () => {
    await addPaperFilingInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      consolidatedGroupDocketNumbers: [],
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    });

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
      );

      expect(
        applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
      ).toHaveBeenCalledTimes(1);
      expect(
        applicationContext.getPersistenceGateway().saveWorkItem,
      ).toHaveBeenCalledTimes(1);
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
      );

      expect(
        applicationContext.getUseCaseHelpers()
          .serveDocumentAndGetPaperServicePdf,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
