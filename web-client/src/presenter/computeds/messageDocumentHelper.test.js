import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { messageDocumentHelper as messageDocumentHeperComputed } from './messageDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('messageDocumentHelper', () => {
  const { USER_ROLES } = applicationContext.getConstants();

  const messageDocumentHelper = withAppContextDecorator(
    messageDocumentHeperComputed,
    applicationContext,
  );

  const getBaseState = user => {
    return {
      permissions: getUserPermissions(user),
    };
  };

  const docketClerkUser = {
    role: USER_ROLES.docketClerk,
    userId: '123',
  };
  const petitionsClerkUser = {
    role: USER_ROLES.petitionsClerk,
    userId: '123',
  };
  const clerkOfCourtUser = {
    role: USER_ROLES.clerkOfCourt,
    userId: '123',
  };
  const judgeUser = {
    role: USER_ROLES.judge,
    userId: '123',
  };
  const petitionerUser = {
    role: USER_ROLES.petitioner,
    userId: '123',
  };

  const baseDocketEntry = {
    docketEntryId: '123',
    entityName: 'Document',
    isDraft: true,
  };

  const baseCorrespondence = {
    correspondenceId: '456',
    documentTitle: 'The Correspondence',
  };

  const baseCaseDetail = {
    archivedCorrespondences: [],
    archivedDocketEntries: [],
    correspondence: [],
    docketEntries: [],
  };

  it('should return an empty object when viewerDocumentToDisplay is not set', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          ...baseCaseDetail,
          docketEntries: [baseDocketEntry],
        },
      },
    });

    expect(result).toEqual({});
  });

  describe('showAddDocketEntryButton', () => {
    it('return showAddDocketEntryButton true for user role of docketClerk and a document that is not on the docket record', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [baseDocketEntry],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showAddDocketEntryButton).toEqual(true);
    });

    it('return showAddDocketEntryButton true for user role of petitionsClerk and a document that is not on the docket record', () => {
      applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [baseDocketEntry],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showAddDocketEntryButton).toEqual(true);
    });

    it('return showAddDocketEntryButton true for user role of clerkOfCourt and a document that is not on the docket record', () => {
      applicationContext.getCurrentUser.mockReturnValue(clerkOfCourtUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(clerkOfCourtUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [baseDocketEntry],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showAddDocketEntryButton).toEqual(true);
    });

    it('return showAddDocketEntryButton false for user role of docketClerk and a document that is already on the docket record', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [{ ...baseDocketEntry, isDraft: false }],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showAddDocketEntryButton).toEqual(false);
    });

    it('return showAddDocketEntryButton false for user role of petitionsClerk and a document that is already on the docket record', () => {
      applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [{ ...baseDocketEntry, isDraft: false }],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showAddDocketEntryButton).toEqual(false);
    });

    it('return showAddDocketEntryButton false for user role of clerkOfCourt and a document that is already on the docket record', () => {
      applicationContext.getCurrentUser.mockReturnValue(clerkOfCourtUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(clerkOfCourtUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [{ ...baseDocketEntry, isDraft: false }],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showAddDocketEntryButton).toEqual(false);
    });

    it('return showAddDocketEntryButton false for other internal user roles and a document that is not on the docket record', () => {
      applicationContext.getCurrentUser.mockReturnValue(judgeUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(judgeUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [baseDocketEntry],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showAddDocketEntryButton).toEqual(false);
    });

    it('return showAddDocketEntryButton false if the document is a correspondence file', () => {
      applicationContext.getCurrentUser.mockReturnValue(judgeUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            correspondence: [
              {
                correspondenceId: '567',
                documentTitle: 'Test Correspondence',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '567',
          },
        },
      });

      expect(result.showAddDocketEntryButton).toEqual(false);
    });
  });

  describe('adding and removing signatures', () => {
    it('return showApplySignatureButton true and showRemoveSignatureButton false for an internal user and an unsigned document that is not on the docket record', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [baseDocketEntry],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showApplySignatureButton).toEqual(true);
      expect(result.showRemoveSignatureButton).toEqual(false);
    });

    it('return showApplySignatureButton false and showRemoveSignatureButton false for an internal user and an SDEC document', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                eventCode: 'SDEC',
                isDraft: true,
                signedAt: '2020-06-25T20:49:28.192Z',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showApplySignatureButton).toEqual(false);
      expect(result.showRemoveSignatureButton).toEqual(false);
    });

    it('return showRemoveSignatureButton true and showApplySignatureButton false for an internal user and a signed document that is not on the docket record', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                signedAt: '2020-06-25T20:49:28.192Z',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showRemoveSignatureButton).toEqual(true);
      expect(result.showApplySignatureButton).toEqual(false);
    });

    it('return showApplySignatureButton false and showRemoveSignatureButton false for an external user and an unsigned document that is not on the docket record', () => {
      applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [baseDocketEntry],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showApplySignatureButton).toEqual(false);
      expect(result.showRemoveSignatureButton).toEqual(false);
    });

    it('return showRemoveSignatureButton false and showApplySignatureButton false for an external user and a signed document that is not on the docket record', () => {
      applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                signedAt: '2020-06-25T20:49:28.192Z',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showRemoveSignatureButton).toEqual(false);
      expect(result.showApplySignatureButton).toEqual(false);
    });

    it('return showApplySignatureButton false and showRemoveSignatureButton false for an unsigned document that is already on the docket record', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [{ ...baseDocketEntry, isDraft: false }],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showApplySignatureButton).toEqual(false);
      expect(result.showRemoveSignatureButton).toEqual(false);
    });

    it('return showRemoveSignatureButton false and showApplySignatureButton false for a signed document that is alreay on the docket record', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                isDraft: false,
                signedAt: '2020-06-25T20:49:28.192Z',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showRemoveSignatureButton).toEqual(false);
      expect(result.showApplySignatureButton).toEqual(false);
    });

    it('returns showRemoveSignatureButton false for NOT document type and internal users', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentTitle: 'Notice',
                documentType: 'Notice',
                eventCode: 'NOT',
                signedAt: '2020-06-25T20:49:28.192Z',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: 'abc',
            eventCode: 'NOT',
          },
        },
      });

      expect(result.showRemoveSignatureButton).toEqual(false);
    });

    it('returns showRemoveSignatureButton false for NTD document type and internal users', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentTitle: 'Notice',
                documentType: 'Notice',
                eventCode: 'NTD',
                signedAt: '2020-06-25T20:49:28.192Z',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: 'abc',
            eventCode: 'NTD',
          },
        },
      });

      expect(result.showRemoveSignatureButton).toEqual(false);
    });

    it('return showApplySignatureButtonForDocument false if the document is a correspondence file', () => {
      applicationContext.getCurrentUser.mockReturnValue(judgeUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            correspondence: [
              {
                correspondenceId: '567',
                documentTitle: 'Test Correspondence',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '567',
          },
        },
      });

      expect(result.showApplySignatureButton).toEqual(false);
    });
  });

  describe('showEditButtonSigned and showEditButtonNotSigned', () => {
    it('return showEditButtonSigned true for an internal user and a document that is not on the docket record and is signed', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                signedAt: '2020-06-25T20:49:28.192Z',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showEditButtonSigned).toEqual(true);
    });

    it('return showEditButtonSigned false for an internal user and an SDEC document', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                eventCode: 'SDEC',
                signedAt: '2020-06-25T20:49:28.192Z',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showEditButtonSigned).toEqual(false);
    });

    it('return showEditButtonNotSigned true for an internal user and a document that is not on the docket record and is not signed', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [baseDocketEntry],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showEditButtonNotSigned).toEqual(true);
    });

    it('return showEditButtonNotSigned false for a correspondence document', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            correspondence: [
              {
                correspondenceId: '567',
                documentTitle: 'Test Correspondence',
                isDraft: true,
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '567',
          },
        },
      });

      expect(result.showEditButtonNotSigned).toEqual(false);
    });

    it('return showEditButtonSigned false for an external user and a document that is not on the docket record', () => {
      applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [baseDocketEntry],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showEditButtonSigned).toEqual(false);
    });

    it('return showEditButtonSigned false for an internal user and a document that is already on the docket record', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [{ ...baseDocketEntry, isDraft: false }],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showEditButtonSigned).toEqual(false);
    });

    it('return showEditButtonNotSigned true and showEditButtonSigned false for Notice document', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                eventCode: 'NOT',
                signedAt: '2020-06-25T20:49:28.192Z',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
            eventCode: 'NOT',
          },
        },
      });

      expect(result.showEditButtonNotSigned).toEqual(true);
      expect(result.showEditButtonSigned).toEqual(false);
    });
  });

  describe('showEditCorrespondenceButton', () => {
    it('should be true for a correspondence document when the user has permission to edit', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            correspondence: [
              {
                correspondenceId: '567',
                documentTitle: 'Test Correspondence',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '567',
          },
        },
      });

      expect(result.showEditCorrespondenceButton).toBeTruthy();
    });

    it('should be false for a correspondence document when the user does not have permission to edit', () => {
      applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            correspondence: [
              {
                correspondenceId: '567',
                documentTitle: 'Test Correspondence',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '567',
          },
        },
      });

      expect(result.showEditCorrespondenceButton).toBeFalsy();
    });

    it('should be false for a non-correspondence document', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [baseDocketEntry],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showEditCorrespondenceButton).toEqual(false);
    });
  });

  describe('showDocumentNotSignedAlert', () => {
    it('should return showDocumentNotSignedAlert false if document is not signed and the event code does not require a signature', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                eventCode: 'MISC', // Does not require a signature
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showDocumentNotSignedAlert).toEqual(false);
    });

    it('should return showDocumentNotSignedAlert true if document is not signed but the event code requires a signature', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                eventCode: 'O', // Requires a signature
                isDraft: false,
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showDocumentNotSignedAlert).toEqual(true);
    });
  });

  describe('serving documents', () => {
    beforeEach(() => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);
    });

    it('should set showNotServed to true when the document is servable, unserved, and not a draft document', () => {
      const { showNotServed } = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                eventCode: 'O',
                isDraft: false,
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(showNotServed).toBe(true);
    });

    it('should set showServeCourtIssuedDocumentButton to false when the document eventCode is not present in the list of court issued documents', () => {
      const { showServeCourtIssuedDocumentButton } = runCompute(
        messageDocumentHelper,
        {
          state: {
            ...getBaseState(docketClerkUser),
            caseDetail: {
              ...baseCaseDetail,
              docketEntries: [
                {
                  docketEntryId: '123',
                  documentTitle: 'PRE-TRIAL MEMORANDUM for Resp. (C/S 5-16-13)',
                  documentType: 'Miscellaneous',
                  eventCode: 'PMT',
                  filedBy: 'See Filings and Proceedings',
                  filingDate: '2013-05-16T00:00:00.000-04:00',
                  index: 14,
                  isFileAttached: true,
                  isMinuteEntry: false,
                  isOnDocketRecord: true,
                  isSealed: false,
                  isStricken: false,
                  numberOfPages: 5,
                  processingStatus: 'complete',
                  receivedAt: '2013-05-16T00:00:00.000-04:00',
                },
              ],
            },
            viewerDocumentToDisplay: {
              documentId: '123',
            },
          },
        },
      );

      expect(showServeCourtIssuedDocumentButton).toBe(false);
    });

    it('should set showServeCourtIssuedDocumentButton to true when the document is a servable court issued document that is unserved, and not a draft document', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Order',
                eventCode: 'O', //court issued document type
                isDraft: false,
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toBe(true);
    });

    it('should set showServePaperFiledDocumentButton to false when the document is a servable court issued document that is unserved, and not a draft document', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Order',
                eventCode: 'O',
                isDraft: false,
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showServePaperFiledDocumentButton).toBe(false);
    });

    it('should set showServePaperFiledDocumentButton to true when the document is  a servable paper filed document that is unserved, and not a draft document', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Answer',
                eventCode: 'A',
                isDraft: false,
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showServePaperFiledDocumentButton).toBe(true);
    });

    it('should set showServeCourtIssuedDocumentButton to false when the document is  a servable paper filed document that is unserved, and not a draft document', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Answer',
                eventCode: 'A', // paper filed document
                isDraft: false,
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toBe(false);
    });

    it('should set showServeCourtIssuedDocumentButton and showServePaperFiledDocumentButton to false when permissions.SERVE_DOCUMENTS is false', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Answer',
                eventCode: 'A', // paper filed document type
                isDraft: false,
              },
              {
                ...baseDocketEntry,
                documentId: '456',
                documentType: 'Order',
                eventCode: 'O', //court issued document type
                isDraft: false,
              },
            ],
          },
          permissions: { SERVE_DOCUMENT: false },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showServeCourtIssuedDocumentButton).toBe(false);
      expect(result.showServePaperFiledDocumentButton).toBe(false);
    });
  });

  describe('showServePetitionButton', () => {
    it('should be false if the document is a served Petition document and the user has SERVE_PETITION permission', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser), // has SERVE_PETITION permission
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Petition',
                eventCode: 'P',
                isDraft: false,
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showServePetitionButton).toEqual(false);
    });

    it('should be false if the document is a not-served Petition document and the user does not have SERVE_PETITION permission', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(judgeUser), // does not have SERVE_PETITION permission
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Petition',
                eventCode: 'P',
                isDraft: false,
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showServePetitionButton).toEqual(false);
    });

    it('should be true if the document is a not-served Petition document and the user has SERVE_PETITION permission', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser), // has SERVE_PETITION permission
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Petition',
                eventCode: 'P',
                isDraft: false,
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showServePetitionButton).toEqual(true);
    });
  });

  describe('editUrl', () => {
    it('should return an editUrl for draft documents', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Miscellaneous',
                eventCode: 'MISC',
                isDraft: true,
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.editUrl).toBeTruthy();
    });

    it('should return an editUrl as an empty string if the document is not found', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Miscellaneous',
                eventCode: 'MISC',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '234',
          },
        },
      });

      expect(result.editUrl).toEqual('');
    });
  });

  describe('showSignStipulatedDecisionButton', () => {
    it('should be true if the user is an internal user, the eventCode is PSDE, the PSDE is served, and the SDEC eventCode is not in the documents', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Proposed Stipulated Decision',
                eventCode: 'PSDE',
                servedAt: '2019-08-25T05:00:00.000Z',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showSignStipulatedDecisionButton).toEqual(true);
    });

    it('should be false if the user is an internal user, the eventCode is PSDE, and the PSDE is not served', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Proposed Stipulated Decision',
                eventCode: 'PSDE',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showSignStipulatedDecisionButton).toBeFalsy();
    });

    it('should be true if the user is an internal user, the document code is PSDE, the PSDE is served, and an archived SDEC eventCode is in the documents', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Proposed Stipulated Decision',
                eventCode: 'PSDE',
                servedAt: '2019-08-25T05:00:00.000Z',
              },
              {
                ...baseDocketEntry,
                archived: true,
                documentId: '234',
                documentType: 'Stipulated Decision',
                eventCode: 'SDEC',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showSignStipulatedDecisionButton).toEqual(true);
    });

    it('should be false if the user is an internal user, the document code is PSDE, the PSDE is served, and the SDEC eventCode is in the documents (and not archived)', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Proposed Stipulated Decision',
                eventCode: 'PSDE',
                servedAt: '2019-08-25T05:00:00.000Z',
              },
              {
                ...baseDocketEntry,
                documentId: '234',
                documentType: 'Stipulated Decision',
                eventCode: 'SDEC',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showSignStipulatedDecisionButton).toEqual(false);
    });

    it('should be false if the user is an external user, the eventCode is PSDE, the PSDE is served, and the SDEC event code is not in the documents', () => {
      applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Proposed Stipulated Decision',
                eventCode: 'PSDE',
                servedAt: '2019-08-25T05:00:00.000Z',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showSignStipulatedDecisionButton).toEqual(false);
    });

    it('should be false if the user is an internal user and the eventCode is not PSDE', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Answer',
                eventCode: 'A',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(result.showSignStipulatedDecisionButton).toEqual(false);
    });
  });

  describe('archived', () => {
    it('should be true when the document is an archived docket entry', () => {
      const { archived } = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            archivedDocketEntries: [
              {
                ...baseDocketEntry,
                archived: true,
                docketEntryId: '789',
                documentType: 'Answer',
                eventCode: 'A',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '789',
          },
        },
      });

      expect(archived).toBeTruthy();
    });

    it('should be true when the document is an archived correspondence', () => {
      const { archived } = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            archivedCorrespondences: [
              {
                ...baseCorrespondence,
                archived: true,
                correspondenceId: '098',
                documentTitle: 'My Correspondence',
                filedBy: 'Docket Clerk',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '098',
          },
        },
      });

      expect(archived).toBeTruthy();
    });

    it('should be false when the document is not an archived correspondence', () => {
      const { archived } = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            archivedCorrespondences: [
              {
                ...baseCorrespondence,
                documentTitle: 'My Correspondence',
                filedBy: 'Docket Clerk',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '456',
          },
        },
      });

      expect(archived).toBeFalsy();
    });

    it('should be false when the document is not an archived document', () => {
      const { isArchived } = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [
              {
                ...baseDocketEntry,
                documentType: 'Answer',
                entityName: 'Document',
                eventCode: 'A',
              },
            ],
          },
          viewerDocumentToDisplay: {
            documentId: '123',
          },
        },
      });

      expect(isArchived).toBeFalsy();
    });
  });

  describe('generate links', () => {
    const PARENT_MESSAGE_ID = 'b52edf38-b34d-4274-a1de-750eadadcc6e';
    const VIEWER_DOCUMENT_ID_TO_DISPLAY =
      'a9ccf24b-5130-4be4-b475-69a794427af6';

    it('should return an addDocketEntryLink', () => {
      const { addDocketEntryLink } = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
          },
          parentMessageId: PARENT_MESSAGE_ID,
          viewerDocumentToDisplay: {
            documentId: VIEWER_DOCUMENT_ID_TO_DISPLAY,
          },
        },
      });

      expect(addDocketEntryLink).toEqual(
        `/case-detail/${baseCaseDetail.docketNumber}/documents/${VIEWER_DOCUMENT_ID_TO_DISPLAY}/add-court-issued-docket-entry/${PARENT_MESSAGE_ID}`,
      );
    });

    it('should return an editCorrespondenceLink', () => {
      const { editCorrespondenceLink } = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
          },
          parentMessageId: PARENT_MESSAGE_ID,
          viewerDocumentToDisplay: {
            documentId: VIEWER_DOCUMENT_ID_TO_DISPLAY,
          },
        },
      });

      expect(editCorrespondenceLink).toEqual(
        `/case-detail/${baseCaseDetail.docketNumber}/edit-correspondence/${VIEWER_DOCUMENT_ID_TO_DISPLAY}/${PARENT_MESSAGE_ID}`,
      );
    });

    it('should return a messageDetailLink', () => {
      const { messageDetailLink } = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
          },
          parentMessageId: PARENT_MESSAGE_ID,
          viewerDocumentToDisplay: {
            documentId: VIEWER_DOCUMENT_ID_TO_DISPLAY,
          },
        },
      });

      expect(messageDetailLink).toEqual(
        `/messages/${baseCaseDetail.docketNumber}/message-detail/${PARENT_MESSAGE_ID}`,
      );
    });

    it('should return a servePetitionLink', () => {
      const { servePetitionLink } = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
          },
          parentMessageId: PARENT_MESSAGE_ID,
          viewerDocumentToDisplay: {
            documentId: VIEWER_DOCUMENT_ID_TO_DISPLAY,
          },
        },
      });

      expect(servePetitionLink).toEqual(
        `/case-detail/${baseCaseDetail.docketNumber}/petition-qc/${PARENT_MESSAGE_ID}`,
      );
    });

    it('should return a signOrderLink', () => {
      const { signOrderLink } = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
          },
          parentMessageId: PARENT_MESSAGE_ID,
          viewerDocumentToDisplay: {
            documentId: VIEWER_DOCUMENT_ID_TO_DISPLAY,
          },
        },
      });

      expect(signOrderLink).toEqual(
        `/case-detail/${baseCaseDetail.docketNumber}/edit-order/${VIEWER_DOCUMENT_ID_TO_DISPLAY}/sign/${PARENT_MESSAGE_ID}`,
      );
    });
  });
});
