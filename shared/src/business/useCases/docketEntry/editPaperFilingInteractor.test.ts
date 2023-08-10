import {
  DOCKET_SECTION,
  DOCUMENT_SERVED_MESSAGES,
  ROLES,
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
  const clientConnectionId = '2810-happydoo';

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
          docketNumber: MOCK_CASE.docketNumber,
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          userId: mockDocketEntryId,
          workItem,
        },
        {
          docketEntryId: mockServedDocketEntryId,
          docketNumber: MOCK_CASE.docketNumber,
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
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

  describe('Save For Later or Serve Agnostic', () => {
    describe('Sad Path', () => {
      it('should throw an error when the user is not authorized to edit docket entries', async () => {
        applicationContext.getCurrentUser.mockImplementation(
          () => petitionerUser,
        );

        await expect(
          editPaperFilingInteractor(applicationContext, {
            clientConnectionId,
            docketEntryId: mockDocketEntryId,
            documentMetadata: {
              docketNumber: caseRecord.docketNumber,
              documentTitle: 'My Document',
              documentType: 'Memorandum in Support',
              eventCode: 'MISP',
              filers: [mockPrimaryId],
              isFileAttached: false,
            },
            isSavingForLater: false,
          }),
        ).rejects.toThrow('Unauthorized');
      });

      it('should throw an error when the docket entry is not found on the case', async () => {
        const notFoundDocketEntryId = 'this is not an ID';

        await expect(
          editPaperFilingInteractor(applicationContext, {
            clientConnectionId,
            docketEntryId: notFoundDocketEntryId,
            documentMetadata: {},
            isSavingForLater: true,
          }),
        ).rejects.toThrow(
          `Docket entry ${notFoundDocketEntryId} was not found.`,
        );
      });

      it('should throw an error when the docket entry has already been served', async () => {
        await expect(
          editPaperFilingInteractor(applicationContext, {
            clientConnectionId,

            docketEntryId: mockServedDocketEntryId,
            documentMetadata: {
              docketNumber: caseRecord.docketNumber,
            },
            isSavingForLater: false,
          }),
        ).rejects.toThrow('Docket entry has already been served');
      });

      it('should throw an error when the docket entry is ready for service but is already pending service', async () => {
        const docketEntry = caseRecord.docketEntries[0];
        docketEntry.isPendingService = true;

        await expect(
          editPaperFilingInteractor(applicationContext, {
            clientConnectionId,
            docketEntryId: docketEntry.docketEntryId,
            documentMetadata: docketEntry,
            isSavingForLater: false,
          }),
        ).rejects.toThrow('Docket entry is already being served');

        expect(
          applicationContext.getUseCaseHelpers()
            .serveDocumentAndGetPaperServicePdf,
        ).not.toHaveBeenCalled();
      });
    });
  });

  describe('Save For Later', () => {
    describe('Happy Path', () => {
      it('should update the docket entry including updating the page count when the docket entry has a file attached', async () => {
        applicationContext
          .getUseCaseHelpers()
          .countPagesInDocument.mockResolvedValueOnce(2);

        await editPaperFilingInteractor(applicationContext, {
          clientConnectionId,
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

        const updatedDocketEntry = applicationContext
          .getUseCaseHelpers()
          .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
            doc => doc.docketEntryId === mockDocketEntryId,
          );
        expect(
          applicationContext.getPersistenceGateway().getCaseByDocketNumber,
        ).toHaveBeenCalled();
        expect(
          applicationContext.getPersistenceGateway().saveWorkItem,
        ).toHaveBeenCalled();
        expect(updatedDocketEntry.numberOfPages).toEqual(2);
      });

      it('should update the docket entry without updating the page count when the docket entry does NOT have a file attached', async () => {
        await editPaperFilingInteractor(applicationContext, {
          clientConnectionId,
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

      it('should not call the persistence method to set and unset the pending service status on the docket entry', async () => {
        await editPaperFilingInteractor(applicationContext, {
          clientConnectionId,
          docketEntryId: mockDocketEntryId,
          documentMetadata: caseRecord.docketEntries[0],
          isSavingForLater: true,
        });

        expect(
          applicationContext.getPersistenceGateway()
            .updateDocketEntryPendingServiceStatus,
        ).not.toHaveBeenCalled();
      });

      it('should not generate a paper service url', async () => {
        await editPaperFilingInteractor(applicationContext, {
          clientConnectionId,
          docketEntryId: mockDocketEntryId,
          documentMetadata: caseRecord.docketEntries[0],
          isSavingForLater: true,
        });

        expect(
          applicationContext.getUseCaseHelpers()
            .serveDocumentAndGetPaperServicePdf,
        ).not.toHaveBeenCalled();
      });

      it('should send a message to the user when persisting edits has completed', async () => {
        await editPaperFilingInteractor(applicationContext, {
          clientConnectionId,
          docketEntryId: mockDocketEntryId,
          documentMetadata: caseRecord.docketEntries[0],
          isSavingForLater: true,
        });

        expect(
          applicationContext.getNotificationGateway().sendNotificationToUser,
        ).toHaveBeenCalledWith({
          applicationContext: expect.anything(),
          clientConnectionId,
          message: {
            action: 'save_docket_entry_for_later_complete',
            alertSuccess: {
              message: 'Entry updated.',
              overwritable: false,
            },
            docketEntryId: mockDocketEntryId,
          },
          userId: docketClerkUser.userId,
        });
      });
    });
  });

  describe('Serve', () => {
    describe('Single Docketing', () => {
      describe('Happy Path', () => {
        it('should update only allowed editable fields on a docket entry document', async () => {
          await editPaperFilingInteractor(applicationContext, {
            clientConnectionId,
            docketEntryId: mockDocketEntryId,
            documentMetadata: {
              docketEntryId:
                'maliciously Update Docket Entry Id.  DONT SAVE ME.',
              docketNumber: 'maliciously Updated Docket Number. DONT SAVE ME.',
              documentTitle: 'My Edited Document',
              documentType: 'Memorandum in Support',
              eventCode: 'MISP',
              filers: [mockPrimaryId],
              freeText: 'Some text about this document',
              hasOtherFilingParty: true,
              isFileAttached: true,
              isPaper: true,
              otherFilingParty: 'Bert Brooks',
            },
            isSavingForLater: false,
          });

          const updatedDocketEntry = applicationContext
            .getPersistenceGateway()
            .updateCase.mock.calls[0][0].caseToUpdate.docketEntries.find(
              d => d.docketEntryId === mockDocketEntryId,
            );

          expect(updatedDocketEntry).toMatchObject({
            docketEntryId: mockDocketEntryId,
            docketNumber: caseRecord.docketEntries[0].docketNumber,
            documentTitle: 'My Edited Document',
            freeText: 'Some text about this document',
            hasOtherFilingParty: true,
            otherFilingParty: 'Bert Brooks',
          });
        });

        it('should call the persistence method to set and unset the pending service status on the docket entry', async () => {
          await editPaperFilingInteractor(applicationContext, {
            clientConnectionId,
            docketEntryId: mockDocketEntryId,
            documentMetadata: caseRecord.docketEntries[0],
            isSavingForLater: false,
          });

          const firstStatusCall =
            applicationContext.getPersistenceGateway()
              .updateDocketEntryPendingServiceStatus.mock.calls[0][0].status;
          const secondStatusCall =
            applicationContext.getPersistenceGateway()
              .updateDocketEntryPendingServiceStatus.mock.calls[1][0].status;
          expect(firstStatusCall).toEqual(true);
          expect(secondStatusCall).toEqual(false);
        });

        it('should send a message to the user with a paper service pdf url when the case has at least one paper service party', async () => {
          const mockPdfUrl = 'www.example.com';
          caseRecord.petitioners[0].serviceIndicator =
            SERVICE_INDICATOR_TYPES.SI_PAPER;
          applicationContext
            .getUseCaseHelpers()
            .serveDocumentAndGetPaperServicePdf.mockReturnValue({
              pdfUrl: mockPdfUrl,
            });

          await editPaperFilingInteractor(applicationContext, {
            clientConnectionId,
            docketEntryId: mockDocketEntryId,
            documentMetadata: {
              documentTitle: 'My Document',
              documentType: 'Memorandum in Support',
              eventCode: 'MISP',
              isFileAttached: true,
            },
            isSavingForLater: false,
          });

          expect(
            applicationContext.getNotificationGateway().sendNotificationToUser,
          ).toHaveBeenCalledWith({
            applicationContext: expect.anything(),
            clientConnectionId,
            message: {
              action: 'serve_document_complete',
              alertSuccess: {
                message: DOCUMENT_SERVED_MESSAGES.GENERIC,
                overwritable: false,
              },
              docketEntryId: mockDocketEntryId,
              generateCoversheet: true,
              pdfUrl: mockPdfUrl,
            },
            userId: docketClerkUser.userId,
          });
        });
      });

      describe('Sad Path', () => {
        it('should call the persistence method to unset the pending service status on the docket entry when an error occurs while serving', async () => {
          applicationContext
            .getUseCaseHelpers()
            .serveDocumentAndGetPaperServicePdf.mockRejectedValueOnce(
              new Error('whoops, that is an error!'),
            );

          await expect(
            editPaperFilingInteractor(applicationContext, {
              clientConnectionId,
              docketEntryId: mockDocketEntryId,
              documentMetadata: caseRecord.docketEntries[0],
              isSavingForLater: false,
            }),
          ).rejects.toThrow('whoops, that is an error!');

          const firstStatusCall =
            applicationContext.getPersistenceGateway()
              .updateDocketEntryPendingServiceStatus.mock.calls[0][0];
          const secondStatusCall =
            applicationContext.getPersistenceGateway()
              .updateDocketEntryPendingServiceStatus.mock.calls[1][0];
          expect(firstStatusCall).toMatchObject({
            docketEntryId: mockDocketEntryId,
            docketNumber: caseRecord.docketNumber,
            status: true,
          });
          expect(secondStatusCall).toMatchObject({
            docketEntryId: mockDocketEntryId,
            docketNumber: caseRecord.docketNumber,
            status: false,
          });
        });
      });
    });

    describe('Multi Docketing', () => {
      describe('Happy Path', () => {
        it('should file and serve the docket entry on all provided docket numbers', async () => {
          applicationContext
            .getPersistenceGateway()
            .getCaseByDocketNumber.mockResolvedValue({
              ...caseRecord,
              leadDocketNumber: caseRecord.docketNumber,
            });
          const mockConsolidatedGroupDocketNumbers = ['101-23', '101-24'];

          await editPaperFilingInteractor(applicationContext, {
            clientConnectionId,
            consolidatedGroupDocketNumbers: mockConsolidatedGroupDocketNumbers,
            docketEntryId: mockDocketEntryId,
            documentMetadata: {
              documentTitle: 'My Document',
              documentType: 'Memorandum in Support',
              eventCode: 'MISP',
              isFileAttached: true,
            },
            isSavingForLater: false,
          });

          const expectedCount = [
            caseRecord.docketNumber,
            ...mockConsolidatedGroupDocketNumbers,
          ].length;
          expect(
            applicationContext.getUseCaseHelpers()
              .fileAndServeDocumentOnOneCase,
          ).toHaveBeenCalledTimes(expectedCount);
        });

        it('should send a message to the user with a paper service pdf url when at least one party in the consolidated group has paper service', async () => {
          const mockedPaperServicePdfUrl = 'www.example.com';
          applicationContext
            .getPersistenceGateway()
            .getCaseByDocketNumber.mockImplementation(({ docketNumber }) =>
              Promise.resolve({
                ...caseRecord,
                docketNumber,
                leadDocketNumber: caseRecord.docketNumber,
                petitioners: [
                  {
                    ...caseRecord.petitioners[0],
                    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
                  },
                ],
              }),
            );
          applicationContext
            .getUseCaseHelpers()
            .fileAndServeDocumentOnOneCase.mockImplementation(
              ({ caseEntity }) => caseEntity,
            );
          applicationContext
            .getUseCaseHelpers()
            .serveDocumentAndGetPaperServicePdf.mockResolvedValue({
              pdfUrl: mockedPaperServicePdfUrl,
            });

          await editPaperFilingInteractor(applicationContext, {
            clientConnectionId,
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
            applicationContext.getUseCaseHelpers()
              .serveDocumentAndGetPaperServicePdf.mock.calls[0][0].caseEntities,
          ).toEqual([
            expect.objectContaining({ docketNumber: caseRecord.docketNumber }),
            expect.objectContaining({ docketNumber: '101-23' }),
            expect.objectContaining({ docketNumber: '101-24' }),
          ]);
          expect(
            applicationContext.getNotificationGateway().sendNotificationToUser,
          ).toHaveBeenCalledWith({
            applicationContext: expect.anything(),
            clientConnectionId,
            message: {
              action: 'serve_document_complete',
              alertSuccess: {
                message: DOCUMENT_SERVED_MESSAGES.SELECTED_CASES,
                overwritable: false,
              },
              docketEntryId: mockDocketEntryId,
              generateCoversheet: true,
              pdfUrl: mockedPaperServicePdfUrl,
            },
            userId: docketClerkUser.userId,
          });
        });

        it('should send a message to the user without a paper service pdf url when no party in the consolidated group has paper service', async () => {
          applicationContext
            .getPersistenceGateway()
            .getCaseByDocketNumber.mockImplementation(({ docketNumber }) =>
              Promise.resolve({
                ...caseRecord,
                docketNumber,
                leadDocketNumber: caseRecord.docketNumber,
                petitioners: [
                  {
                    ...caseRecord.petitioners[0],
                    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
                  },
                ],
              }),
            );
          applicationContext
            .getUseCaseHelpers()
            .fileAndServeDocumentOnOneCase.mockImplementation(
              ({ caseEntity }) => caseEntity,
            );
          applicationContext
            .getUseCaseHelpers()
            .serveDocumentAndGetPaperServicePdf.mockResolvedValue(undefined);

          await editPaperFilingInteractor(applicationContext, {
            clientConnectionId,
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
            applicationContext.getNotificationGateway().sendNotificationToUser,
          ).toHaveBeenCalledWith({
            applicationContext: expect.anything(),
            clientConnectionId,
            message: {
              action: 'serve_document_complete',
              alertSuccess: {
                message: DOCUMENT_SERVED_MESSAGES.SELECTED_CASES,
                overwritable: false,
              },
              docketEntryId: mockDocketEntryId,
              generateCoversheet: true,
              pdfUrl: undefined,
            },
            userId: docketClerkUser.userId,
          });
        });
      });

      describe('Sad Path', () => {
        it('should throw an error when a docket number included in the request is NOT a member of the consolidated group', async () => {
          const nonConsolidatedDocketNumber = '101-19';
          applicationContext
            .getPersistenceGateway()
            .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
              if (docketNumber === caseRecord.docketNumber) {
                return {
                  ...caseRecord,
                  leadDocketNumber: caseRecord.docketNumber,
                };
              } else if (docketNumber === nonConsolidatedDocketNumber) {
                return { leadDocketNumber: undefined };
              }
            });

          await expect(
            editPaperFilingInteractor(applicationContext, {
              clientConnectionId,
              consolidatedGroupDocketNumbers: [nonConsolidatedDocketNumber],
              docketEntryId: mockDocketEntryId,
              documentMetadata: caseRecord.docketEntries[0],
              isSavingForLater: false,
            }),
          ).rejects.toThrow(
            'Cannot multi-docket on a case that is not consolidated',
          );
        });

        it('should throw an error when the requested subject case is NOT consolidated', async () => {
          applicationContext
            .getPersistenceGateway()
            .getCaseByDocketNumber.mockResolvedValue({
              ...caseRecord,
              leadDocketNumber: undefined,
            });

          await expect(
            editPaperFilingInteractor(applicationContext, {
              clientConnectionId,
              consolidatedGroupDocketNumbers: ['101-23'],
              docketEntryId: mockDocketEntryId,
              documentMetadata: {
                docketNumber: caseRecord.docketNumber,
                isFileAttached: true,
              },
              isSavingForLater: false,
            }),
          ).rejects.toThrow(
            'Cannot multi-docket on a case that is not consolidated',
          );
        });
      });
    });
  });
});
