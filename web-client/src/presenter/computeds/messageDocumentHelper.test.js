import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { messageDocumentHelper as messageDocumentHeperComputed } from './messageDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';
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

describe('messageDocumentHelper', () => {
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

  it('return null if viewerDocumentToDisplay is not set', () => {
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

    expect(result).toEqual(null);
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
                signedAt: '123',
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
                signedAt: '123',
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
    it('return showEditCorrespondenceButton true for a correspondence document', () => {
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

      expect(result.showEditCorrespondenceButton).toEqual(true);
    });

    it('return showEditCorrespondenceButton false for a non-correspondence document', () => {
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
    it('should be true if the user is an internal user, the eventCode is PSDE, and the SDEC eventCode is not in the documents', () => {
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

      expect(result.showSignStipulatedDecisionButton).toEqual(true);
    });

    it('should be true if the user is an internal user, the document code is PSDE, and an archived SDEC eventCode is in the documents', () => {
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

    it('should be false if the user is an internal user, the document code is PSDE, and the SDEC eventCode is in the documents (and not archived)', () => {
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

    it('should be false if the user is an external user, the eventCode is PSDE, and the SDEC event code is not in the documents', () => {
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
});
