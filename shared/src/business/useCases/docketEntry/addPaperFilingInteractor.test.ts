import {
  AUTOMATIC_BLOCKED_REASONS,
  DOCKET_SECTION,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
const {
  MOCK_CASE,
  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
  MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} = require('../../../test/mockCase');
const { addPaperFilingInteractor } = require('./addPaperFilingInteractor');
const { Case } = require('../../entities/cases/Case');

describe('addPaperFilingInteractor', () => {
  let mockCase;

  const user = {
    name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
    role: ROLES.docketClerk,
    section: DOCKET_SECTION,
    userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };
  const clientConnectionId = '987654';

  beforeEach(() => {
    mockCase = { ...MOCK_CASE, leadDocketNumber: MOCK_CASE.docketNumber };

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(user);

    applicationContext.getCurrentUser.mockReturnValue(user);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);

    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockReturnValue(Promise.resolve(true));
  });

  it('should throw an error when the user is not authorized to add a paper filing', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      addPaperFilingInteractor(applicationContext, {}),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when the document metadata is not provided', async () => {
    await expect(
      addPaperFilingInteractor(applicationContext, {}),
    ).rejects.toThrow('Did not receive meta data for docket entry');
  });

  it('should throw an error when primaryDocumentFileId is not provided', async () => {
    await expect(
      addPaperFilingInteractor(applicationContext, {
        documentMetadata: {},
        primaryDocumentFileId: undefined,
      }),
    ).rejects.toThrow('Did not receive a primaryDocumentFileId');
  });

  it('should add documents and send service emails for electronic service parties', async () => {
    const mockPrimaryDocumentFileId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';

    await addPaperFilingInteractor(applicationContext, {
      clientConnectionId,
      consolidatedGroupDocketNumbers: [mockCase.docketNumber],
      documentMetadata: {
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: mockCase.docketNumber,
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filedBy: 'Test Petitioner',
        isFileAttached: true,
        isPaper: true,
      },
      isSavingForLater: false,
      primaryDocumentFileId: mockPrimaryDocumentFileId,
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf
        .mock.calls[0][0].docketEntryId,
    ).toEqual(mockPrimaryDocumentFileId);
  });

  it('should return paper service url when the case has paper service parties', async () => {
    const mockPdfUrl = 'www.example.com';
    mockCase.petitioners[0].serviceIndicator = SERVICE_INDICATOR_TYPES.SI_PAPER;
    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });

    const result = await addPaperFilingInteractor(applicationContext, {
      clientConnectionId,
      consolidatedGroupDocketNumbers: [mockCase.docketNumber],
      documentMetadata: {
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: mockCase.docketNumber,
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filedBy: 'Test Petitioner',
        isFileAttached: true,
        isPaper: true,
      },
      isSavingForLater: false,
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(result.paperServicePdfUrl).toEqual(mockPdfUrl);
  });

  it('should add documents and workItem to inbox when saving for later when a document is attached', async () => {
    await addPaperFilingInteractor(applicationContext, {
      clientConnectionId,
      consolidatedGroupDocketNumbers: [mockCase.docketNumber],
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
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
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
      clientConnectionId,
      consolidatedGroupDocketNumbers: [mockCase.docketNumber],
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
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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

  it('add documents and workItem to inbox when NOT saving for later if a document is attached', async () => {
    await addPaperFilingInteractor(applicationContext, {
      consolidatedGroupDocketNumbers: [mockCase.docketNumber],
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
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).toHaveBeenCalled();
  });

  it('sets the case as blocked if the document filed is a tracked document type', async () => {
    await addPaperFilingInteractor(applicationContext, {
      clientConnectionId,
      consolidatedGroupDocketNumbers: [mockCase.docketNumber],
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
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
      clientConnectionId,
      consolidatedGroupDocketNumbers: [mockCase.docketNumber],
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
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
        clientConnectionId,
        consolidatedGroupDocketNumbers: [mockCase.docketNumber],
        documentMetadata: {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: mockCase.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
          isFileAttached: true,
          isPaper: true,
        },
        isSavingForLater: false,
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow(new Error('bad!'));

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).not.toHaveBeenCalled();
  });

  it('should use original case caption to create case title when creating work item', async () => {
    await addPaperFilingInteractor(applicationContext, {
      clientConnectionId,
      consolidatedGroupDocketNumbers: [mockCase.docketNumber],
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
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[0][0]
        .workItem,
    ).toMatchObject({
      caseTitle: Case.getCaseTitle(mockCase.caseCaption),
    });
  });

  describe('consolidated groups', () => {
    it('should create a work item and add it to the outbox for each case', async () => {
      const mockConsolidatedGroup = [
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
        MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
        MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
      ];
      await addPaperFilingInteractor(applicationContext, {
        clientConnectionId,
        consolidatedGroupDocketNumbers: mockConsolidatedGroup,
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
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });

      expect(
        applicationContext.getPersistenceGateway().saveWorkItem,
      ).toHaveBeenCalledTimes(mockConsolidatedGroup.length);
    });

    it('should still save only one copy of the document to s3', async () => {
      const mockConsolidatedGroup = [
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
        MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
        MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
      ];

      await addPaperFilingInteractor(applicationContext, {
        clientConnectionId,
        consolidatedGroupDocketNumbers: mockConsolidatedGroup,
        documentMetadata: {
          docketNumber: MOCK_CASE.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filedBy: 'Test Petitioner',
          isFileAttached: true,
          isPaper: true,
        },
        isSavingForLater: false,
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });

      expect(
        applicationContext.getUseCaseHelpers()
          .serveDocumentAndGetPaperServicePdf,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
