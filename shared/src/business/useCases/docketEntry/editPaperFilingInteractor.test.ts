import {
  DOCKET_SECTION,
  SERVICE_INDICATOR_TYPES,
} from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { docketClerkUser, petitionerUser } from '../../../test/mockUsers';
import { editPaperFilingInteractor } from './editPaperFilingInteractor';
import { getContactPrimary } from '../../entities/cases/Case';

describe('editPaperFilingInteractor', () => {
  let caseRecord;

  const mockDocketEntryId = '50107716-6d08-4693-bfd5-a07a4e6eadce';
  const mockServedDocketEntryId = '08ecbf7e-b316-46bb-9a66-b7474823d202';
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
          docketEntryId: mockServedDocketEntryId,
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

    applicationContext.getCurrentUser.mockImplementation(() => docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseRecord);
  });

  it('should throw an error when the user is not authorized to edit docket entries', async () => {
    applicationContext.getCurrentUser.mockImplementation(() => petitionerUser);

    await expect(
      editPaperFilingInteractor(applicationContext, {
        docketEntryId: '',
        documentMetadata: {},
      } as any),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when the docket entry is not found on the case', async () => {
    const notFoundDocketEntryId = 'this is not an ID';

    await expect(
      editPaperFilingInteractor(applicationContext, {
        docketEntryId: notFoundDocketEntryId,
        documentMetadata: {},
      } as any),
    ).rejects.toThrow(`Docket entry ${notFoundDocketEntryId} was not found.`);
  });

  it('should throw an error when the docket entry has already been served', async () => {
    await expect(
      editPaperFilingInteractor(applicationContext, {
        docketEntryId: mockServedDocketEntryId,
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
        },
      } as any),
    ).rejects.toThrow('Docket entry has already been served');
  });

  it('should throw an error when the docket entry is ready for service but is already pending service', async () => {
    const docketEntry = caseRecord.docketEntries[0];
    docketEntry.isPendingService = true;

    await expect(
      editPaperFilingInteractor(applicationContext, {
        docketEntryId: docketEntry.docketEntryId,
        documentMetadata: docketEntry,
        isSavingForLater: false,
      }),
    ).rejects.toThrow('Docket entry is already being served');

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).not.toHaveBeenCalled();
  });

  it('should not throw an error indicating the document is already pending service when the docket entry is being saved for later', async () => {
    await expect(
      editPaperFilingInteractor(applicationContext, {
        docketEntryId: mockDocketEntryId,
        documentMetadata: {
          ...caseRecord.docketEntries[0],
          isPendingService: true,
        },
        isSavingForLater: true,
      }),
    ).resolves.not.toThrow();
  });

  it('should update only allowed editable fields on a docket entry document', async () => {
    await editPaperFilingInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
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

  it('should update the docket entry and work item with a file attached when the docket entry is being saved for later', async () => {
    await editPaperFilingInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'My Document',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filers: [mockPrimaryId],
        isFileAttached: true,
      },
      isSavingForLater: true,
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

  it('should update the docket entry and workitem when a file is NOT attached to the docket entry and it is being saved for later', async () => {
    await editPaperFilingInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'My Document',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filers: [mockPrimaryId],
        isFileAttached: false,
      },
      isSavingForLater: true,
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
    ).not.toHaveBeenCalled();
  });

  it('should call the persistence method to set and unset the pending service status on the docket entry when it is NOT being saved for later', async () => {
    const docketEntry = caseRecord.docketEntries[0];
    docketEntry.isPendingService = false;
    docketEntry.workItem = workItem;

    await editPaperFilingInteractor(applicationContext, {
      docketEntryId: docketEntry.docketEntryId,
      documentMetadata: docketEntry,
      isSavingForLater: false,
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

  it('should not call the persistence method to set and unset the pending service status on the docket entry when it`s being saved for later', async () => {
    const docketEntry = caseRecord.docketEntries[0];
    docketEntry.isPendingService = false;
    docketEntry.workItem = workItem;

    await editPaperFilingInteractor(applicationContext, {
      docketEntryId: docketEntry.docketEntryId,
      documentMetadata: docketEntry,
      isSavingForLater: true,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).not.toHaveBeenCalled();
  });

  it('should call the persistence method to unset the pending service status on the docket entry when it`s NOT being saved for later and an error occurs while serving', async () => {
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
        docketEntryId: docketEntry.docketEntryId,
        documentMetadata: docketEntry,
        isSavingForLater: false,
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

  it('should NOT call the persistence method to unset the pending service status on the docket entry when it is being saved for later and an error occurs while updating it', async () => {
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
        docketEntryId: docketEntry.docketEntryId,
        documentMetadata: docketEntry,
        isSavingForLater: true,
      }),
    ).rejects.toThrow('whoops, that is an error!');

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).not.toHaveBeenCalled();
  });

  it('should return a paper service pdf url when the case has at least one paper service party and the docket entry is NOT being saved for later', async () => {
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
        docketEntryId: mockDocketEntryId,
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'My Document',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          isFileAttached: true,
        },
      } as any,
    );

    expect(paperServicePdfUrl).toEqual(mockPdfUrl);
  });

  describe('multi-docketing', () => {
    it('should throw an error when the docket entry is being multi-docketed on a member case that is NOT consolidated', async () => {
      const nonConsolidatedDocketNumber = '101-19';
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
          if (docketNumber === caseRecord.docketNumber) {
            return { ...caseRecord, leadDocketNumber: caseRecord.docketNumber };
          } else if (docketNumber === nonConsolidatedDocketNumber) {
            return { leadDocketNumber: undefined };
          }
        });

      await expect(
        editPaperFilingInteractor(applicationContext, {
          consolidatedGroupDocketNumbers: [nonConsolidatedDocketNumber],
          docketEntryId: mockDocketEntryId,
          documentMetadata: caseRecord.docketEntries[0],
          isSavingForLater: false,
        }),
      ).rejects.toThrow(
        'Cannot multi-docket on a case that is not consolidated',
      );
    });

    it('should throw an error when the docket entry is being filed on a case that is NOT consolidated and the request includes consolidated group docket numbers to multi-docket on', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockResolvedValue({
          ...caseRecord,
          leadDocketNumber: undefined,
        });

      await expect(
        editPaperFilingInteractor(applicationContext, {
          consolidatedGroupDocketNumbers: ['101-23'],
          docketEntryId: mockDocketEntryId,
          documentMetadata: { docketNumber: caseRecord.docketNumber },
          isSavingForLater: false,
        }),
      ).rejects.toThrow(
        'Cannot multi-docket on a case that is not consolidated',
      );
    });

    it('should file and serve the docket entry on all provided docket numbers when the user requests the docket entry be multi-docketed on a consolidated group', async () => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockResolvedValue({
          ...caseRecord,
          leadDocketNumber: caseRecord.docketNumber,
        });

      await editPaperFilingInteractor(applicationContext, {
        consolidatedGroupDocketNumbers: ['101-23', '101-24'],
        docketEntryId: mockDocketEntryId,
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'My Document',
          documentType: 'Memorandum in Support',
          eventCode: 'MISP',
          isFileAttached: true,
        },
        isSavingForLater: false,
      });

      expect(
        applicationContext.getUseCaseHelpers().fileAndServeDocumentOnOneCase,
      ).toHaveBeenCalledTimes(3);
    });
  });
});
