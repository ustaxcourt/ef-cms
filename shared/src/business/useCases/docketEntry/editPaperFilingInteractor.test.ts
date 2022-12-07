import {
  DOCKET_SECTION,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { editPaperFilingInteractor } from './editPaperFilingInteractor';
import { getContactPrimary } from '../../entities/cases/Case';

describe('editPaperFilingInteractor', () => {
  let mockCurrentUser;
  let caseRecord;

  const mockDocketEntryId = '08ecbf7e-b316-46bb-9ac6-b7474823d202';
  const mockWorkItemId = 'a956aa05-19cb-4fc3-ba10-d97c1c567c12';

  const mockPrimaryId = getContactPrimary(MOCK_CASE).contactId;

  const workItem = {
    docketEntry: {
      docketEntryId: mockDocketEntryId,
      documentType: 'Answer',
      eventCode: 'A',
      userId: mockDocketEntryId,
    } as any,
    docketNumber: '45678-18',
    section: DOCKET_SECTION,
    sentBy: mockDocketEntryId,
    updatedAt: applicationContext.getUtilities().createISODateString(),
    workItemId: mockWorkItemId,
  };

  beforeEach(() => {
    caseRecord = {
      ...MOCK_CASE,
      docketEntries: [
        ...MOCK_CASE.docketEntries,
        {
          docketEntryId: mockDocketEntryId,
          docketNumber: '45678-18',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          userId: mockDocketEntryId,
          workItem,
        },
        {
          docketEntryId: '08ecbf7e-b316-46bb-9a66-b7474823d202',
          docketNumber: '45678-18',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          servedAt: '2019-08-25T05:00:00.000Z',
          servedParties: [
            {
              email: 'test@example.com',
              name: 'guy',
              role: 'privatePractitioner',
            },
          ],
          userId: mockDocketEntryId,
          workItem,
        },
      ],
    };

    mockCurrentUser = {
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: 'b266b7dc-e3b3-41a2-8c66-27e2680d58f0',
    };

    applicationContext.getCurrentUser.mockImplementation(() => mockCurrentUser);
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: 'b266b7dc-e3b3-41a2-8c66-27e2680d58f0',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseRecord);
  });

  it('should throw an error if not authorized', async () => {
    mockCurrentUser = {};

    await expect(
      editPaperFilingInteractor(applicationContext, {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
        },
        primaryDocumentFileId: mockDocketEntryId,
      } as any),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if docket entry is not found', async () => {
    const notFoundDocketEntryId = 'this is not an ID';
    await expect(
      editPaperFilingInteractor(applicationContext, {
        documentMetadata: {},
        primaryDocumentFileId: notFoundDocketEntryId,
      } as any),
    ).rejects.toThrow(`Docket entry ${notFoundDocketEntryId} was not found.`);
  });

  it('should throw an error if the docket entry has already been served', async () => {
    await expect(
      editPaperFilingInteractor(applicationContext, {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'My Document',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filers: [mockPrimaryId],
          isFileAttached: false,
        },
        primaryDocumentFileId: '08ecbf7e-b316-46bb-9a66-b7474823d202',
      } as any),
    ).rejects.toThrow('Docket entry has already been served');
  });

  it('updates the workitem without updating the document if no file is attached', async () => {
    await editPaperFilingInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'My Document',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filers: [mockPrimaryId],
        isFileAttached: false,
      },
      primaryDocumentFileId: mockDocketEntryId,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('adds documents and workitems', async () => {
    await editPaperFilingInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'My Document',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filers: [mockPrimaryId],
        isFileAttached: true,
      },
      primaryDocumentFileId: mockDocketEntryId,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('should return paper service pdf url if the case has paper service parties', async () => {
    const mockPdfUrl = 'www.example.com';

    caseRecord.petitioners[0].serviceIndicator =
      SERVICE_INDICATOR_TYPES.SI_PAPER;
    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });

    const { paperServicePdfUrl } = await editPaperFilingInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'My Document',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filers: [mockPrimaryId],
          isFileAttached: true,
        },
        primaryDocumentFileId: mockDocketEntryId,
      } as any,
    );

    expect(paperServicePdfUrl).toEqual(mockPdfUrl);
  });

  it('adds documents and workitems but does not try to delete workitem because they all have files attached', async () => {
    workItem.docketEntry.isFileAttached = true;

    await editPaperFilingInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'My Document',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filers: [mockPrimaryId],
        isFileAttached: true,
      },
      primaryDocumentFileId: mockDocketEntryId,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('should update only allowed editable fields on a docket entry document', async () => {
    await editPaperFilingInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'My Edited Document',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filers: [mockPrimaryId],
        freeText: 'Some text about this document',
        hasOtherFilingParty: true,
        isPaper: true,
        otherFilingParty: 'Bert Brooks',
      },
      primaryDocumentFileId: mockDocketEntryId,
    } as any);

    const updatedDocketEntry = applicationContext
      .getPersistenceGateway()
      .updateCase.mock.calls[0][0].caseToUpdate.docketEntries.find(
        d => d.docketEntryId === mockDocketEntryId,
      );

    expect(updatedDocketEntry).toMatchObject({
      documentTitle: 'My Edited Document',
      freeText: 'Some text about this document',
      hasOtherFilingParty: true,
      otherFilingParty: 'Bert Brooks',
    });
  });

  it('updates document and workitem metadata with a file attached, but saving for later', async () => {
    await editPaperFilingInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'My Document',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filers: [mockPrimaryId],
        isFileAttached: true,
      },
      isSavingForLater: true,
      primaryDocumentFileId: mockDocketEntryId,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).toHaveBeenCalled();
  });

  it('updates document and workitem metadata with no file attached', async () => {
    await editPaperFilingInteractor(applicationContext, {
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'My Document',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filers: [mockPrimaryId],
        isFileAttached: false,
      },
      isSavingForLater: true,
      primaryDocumentFileId: mockDocketEntryId,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('should throw an error if the document is ready for service but is already pending service', async () => {
    const docketEntry = caseRecord.docketEntries[0];
    docketEntry.isPendingService = true;

    await expect(
      editPaperFilingInteractor(applicationContext, {
        documentMetadata: {
          ...docketEntry,
        },
        isSavingForLater: false,
        primaryDocumentFileId: docketEntry.docketEntryId,
      }),
    ).rejects.toThrow('Docket entry is already being served');

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).not.toHaveBeenCalled();
  });

  it('should not throw an error indicating the document is already pending service if the document is not ready for service', async () => {
    const docketEntry = caseRecord.docketEntries[0];
    docketEntry.isPendingService = true;
    docketEntry.workItem = workItem;

    await expect(
      editPaperFilingInteractor(applicationContext, {
        documentMetadata: {
          ...docketEntry,
          documentTitle: 'My Document',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          filers: [mockPrimaryId],
          isFileAttached: false,
        },
        isSavingForLater: true,
        primaryDocumentFileId: docketEntry.docketEntryId,
      }),
    ).resolves.not.toThrow();
  });

  it('should call the persistence method to set and unset the pending service status on the document if its ready for service', async () => {
    const docketEntry = caseRecord.docketEntries[0];
    docketEntry.isPendingService = false;
    docketEntry.workItem = workItem;

    await editPaperFilingInteractor(applicationContext, {
      documentMetadata: {
        ...docketEntry,
        isFileAttached: true,
      },
      isSavingForLater: false,
      primaryDocumentFileId: docketEntry.docketEntryId,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId: docketEntry.docketEntryId,
      docketNumber: caseRecord.docketNumber,
      status: true,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId: docketEntry.docketEntryId,
      docketNumber: caseRecord.docketNumber,
      status: false,
    });
  });

  it('should not call the persistence method to set and unset the pending service status on the document if its not ready for service', async () => {
    const docketEntry = caseRecord.docketEntries[0];
    docketEntry.isPendingService = false;
    docketEntry.workItem = workItem;

    await editPaperFilingInteractor(applicationContext, {
      documentMetadata: {
        ...docketEntry,
      },
      isSavingForLater: true,
      primaryDocumentFileId: docketEntry.docketEntryId,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).not.toHaveBeenCalled();
  });

  it('should call the persistence method to unset the pending service status on the document if its ready for service and an error occurs while serving', async () => {
    const docketEntry = caseRecord.docketEntries[0];
    docketEntry.isPendingService = false;
    docketEntry.workItem = workItem;

    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockRejectedValueOnce(
        new Error('whoops, that is an error!'),
      );

    await expect(
      editPaperFilingInteractor(applicationContext, {
        documentMetadata: {
          ...docketEntry,
          isFileAttached: true,
        },
        isSavingForLater: false,
        primaryDocumentFileId: docketEntry.docketEntryId,
      }),
    ).rejects.toThrow('whoops, that is an error!');

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId: docketEntry.docketEntryId,
      docketNumber: caseRecord.docketNumber,
      status: true,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId: docketEntry.docketEntryId,
      docketNumber: caseRecord.docketNumber,
      status: false,
    });
  });

  it('should not call the persistence method to unset the pending service status on the document if its not ready for service and an error occurs while serving', async () => {
    const docketEntry = caseRecord.docketEntries[0];
    docketEntry.isPendingService = false;
    docketEntry.workItem = workItem;

    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockRejectedValueOnce(
        new Error('whoops, that is an error!'),
      );

    await expect(
      editPaperFilingInteractor(applicationContext, {
        documentMetadata: {
          ...docketEntry,
          isFileAttached: true,
        },
        isSavingForLater: true,
        primaryDocumentFileId: docketEntry.docketEntryId,
      }),
    ).rejects.toThrow('whoops, that is an error!');

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).not.toHaveBeenCalled();
  });
});
