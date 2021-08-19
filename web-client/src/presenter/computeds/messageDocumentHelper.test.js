/* eslint-disable max-lines */
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import {
  clerkOfCourtUser,
  docketClerkUser,
  judgeUser,
  petitionerUser,
  petitionsClerkUser,
} from '../../../../shared/src/test/mockUsers';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { messageDocumentHelper as messageDocumentHeperComputed } from './messageDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

let globalUser;

const messageDocumentHelper = withAppContextDecorator(
  messageDocumentHeperComputed,
  {
    ...applicationContext,
    getCurrentUser: () => {
      return globalUser;
    },
  },
);

describe('messageDocumentHelper', () => {
  const mockDocumentId = '968b10f7-d111-45a9-8729-df050ff6c961';
  const mockParentMessageId = 'b5c87dd2-98b1-462a-9c21-ff6bb1e0c9f7';

  const baseDocketEntry = {
    docketEntryId: mockDocumentId,
    entityName: 'DocketEntry',
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

  const getBaseState = user => {
    globalUser = user;
    return {
      caseDetail: {
        ...baseCaseDetail,
        docketEntries: [baseDocketEntry],
      },
      messageViewerDocumentToDisplay: {
        documentId: mockDocumentId,
      },
      parentMessageId: mockParentMessageId,
      permissions: getUserPermissions(user),
    };
  };

  it('return empty object if messageViewerDocumentToDisplay is not set', () => {
    const result = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        messageViewerDocumentToDisplay: {},
      },
    });

    expect(result).toEqual({});
  });

  describe('showAddDocketEntryButton', () => {
    it('return showAddDocketEntryButton true for user role of docketClerk and a document that is not on the docket record', () => {
      const result = runCompute(messageDocumentHelper, {
        state: getBaseState(docketClerkUser),
      });

      expect(result.showAddDocketEntryButton).toEqual(true);
    });

    it('return showAddDocketEntryButton true for user role of petitionsClerk and a document that is not on the docket record', () => {
      const result = runCompute(messageDocumentHelper, {
        state: getBaseState(petitionsClerkUser),
      });

      expect(result.showAddDocketEntryButton).toEqual(true);
    });

    it('return showAddDocketEntryButton true for user role of clerkOfCourt and a document that is not on the docket record', () => {
      const result = runCompute(messageDocumentHelper, {
        state: getBaseState(clerkOfCourtUser),
      });

      expect(result.showAddDocketEntryButton).toEqual(true);
    });

    it('return showAddDocketEntryButton false for user role of docketClerk and a document that is already on the docket record', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [{ ...baseDocketEntry, isDraft: false }],
          },
        },
      });

      expect(result.showAddDocketEntryButton).toEqual(false);
    });

    it('return showAddDocketEntryButton false for user role of petitionsClerk and a document that is already on the docket record', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [{ ...baseDocketEntry, isDraft: false }],
          },
        },
      });

      expect(result.showAddDocketEntryButton).toEqual(false);
    });

    it('return showAddDocketEntryButton false for user role of clerkOfCourt and a document that is already on the docket record', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(clerkOfCourtUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [{ ...baseDocketEntry, isDraft: false }],
          },
        },
      });

      expect(result.showAddDocketEntryButton).toEqual(false);
    });

    it('return showAddDocketEntryButton false for other internal user roles and a document that is not on the docket record', () => {
      const result = runCompute(messageDocumentHelper, {
        state: getBaseState(judgeUser),
      });

      expect(result.showAddDocketEntryButton).toEqual(false);
    });

    it('return showAddDocketEntryButton false if the document is a correspondence file', () => {
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
          messageViewerDocumentToDisplay: {
            documentId: '567',
          },
        },
      });

      expect(result.showAddDocketEntryButton).toEqual(false);
    });
  });

  describe('adding and removing signatures', () => {
    it('return showApplySignatureButton true and showRemoveSignatureButton false for an internal user and an unsigned document that is not on the docket record', () => {
      const result = runCompute(messageDocumentHelper, {
        state: getBaseState(docketClerkUser),
      });

      expect(result.showApplySignatureButton).toEqual(true);
      expect(result.showRemoveSignatureButton).toEqual(false);
    });

    it('return showApplySignatureButton false and showRemoveSignatureButton false for an internal user and an SDEC document', () => {
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
        },
      });

      expect(result.showApplySignatureButton).toEqual(false);
      expect(result.showRemoveSignatureButton).toEqual(false);
    });

    it('return showRemoveSignatureButton true and showApplySignatureButton false for an internal user and a signed document that is not on the docket record', () => {
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
        },
      });

      expect(result.showRemoveSignatureButton).toEqual(true);
      expect(result.showApplySignatureButton).toEqual(false);
    });

    it('return showApplySignatureButton false and showRemoveSignatureButton false for an external user and an unsigned document that is not on the docket record', () => {
      const result = runCompute(messageDocumentHelper, {
        state: getBaseState(petitionerUser),
      });

      expect(result.showApplySignatureButton).toEqual(false);
      expect(result.showRemoveSignatureButton).toEqual(false);
    });

    it('return showRemoveSignatureButton false and showApplySignatureButton false for an external user and a signed document that is not on the docket record', () => {
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
        },
      });

      expect(result.showRemoveSignatureButton).toEqual(false);
      expect(result.showApplySignatureButton).toEqual(false);
    });

    it('return showApplySignatureButton false and showRemoveSignatureButton false for an unsigned document that is already on the docket record', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [{ ...baseDocketEntry, isDraft: false }],
          },
        },
      });

      expect(result.showApplySignatureButton).toEqual(false);
      expect(result.showRemoveSignatureButton).toEqual(false);
    });

    it('return showRemoveSignatureButton false and showApplySignatureButton false for a signed document that is alreay on the docket record', () => {
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
        },
      });

      expect(result.showRemoveSignatureButton).toEqual(false);
      expect(result.showApplySignatureButton).toEqual(false);
    });

    it('returns showRemoveSignatureButton false for NOT document type and internal users', () => {
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
          messageViewerDocumentToDisplay: {
            documentId: 'abc',
          },
        },
      });

      expect(result.showRemoveSignatureButton).toEqual(false);
    });

    it('returns showRemoveSignatureButton false for NTD document type and internal users', () => {
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
          messageViewerDocumentToDisplay: {
            documentId: 'abc',
          },
        },
      });

      expect(result.showRemoveSignatureButton).toEqual(false);
    });

    it('return showApplySignatureButtonForDocument false if the document is a correspondence file', () => {
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
          messageViewerDocumentToDisplay: {
            documentId: '567',
          },
        },
      });

      expect(result.showApplySignatureButton).toEqual(false);
    });
  });

  describe('showEditButtonSigned and showEditButtonNotSigned', () => {
    it('return showEditButtonSigned true for an internal user and a document that is not on the docket record and is signed', () => {
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
        },
      });

      expect(result.showEditButtonSigned).toEqual(true);
    });

    it('return showEditButtonSigned false for an internal user and an SDEC document', () => {
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
        },
      });

      expect(result.showEditButtonSigned).toEqual(false);
    });

    it('return showEditButtonNotSigned true for an internal user and a document that is not on the docket record and is not signed', () => {
      const result = runCompute(messageDocumentHelper, {
        state: getBaseState(docketClerkUser),
      });

      expect(result.showEditButtonNotSigned).toEqual(true);
    });

    it('return showEditButtonNotSigned false for a correspondence document', () => {
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
          messageViewerDocumentToDisplay: {
            documentId: '567',
          },
        },
      });

      expect(result.showEditButtonNotSigned).toEqual(false);
    });

    it('return showEditButtonSigned false for an external user and a document that is not on the docket record', () => {
      const result = runCompute(messageDocumentHelper, {
        state: getBaseState(petitionerUser),
      });

      expect(result.showEditButtonSigned).toEqual(false);
    });

    it('return showEditButtonSigned false for an internal user and a document that is already on the docket record', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            ...baseCaseDetail,
            docketEntries: [{ ...baseDocketEntry, isDraft: false }],
          },
        },
      });

      expect(result.showEditButtonSigned).toEqual(false);
    });

    it('return showEditButtonNotSigned true and showEditButtonSigned false for Notice document', () => {
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
        },
      });

      expect(result.showEditButtonNotSigned).toEqual(true);
      expect(result.showEditButtonSigned).toEqual(false);
    });
  });

  describe('showEditCorrespondenceButton', () => {
    it('returns true for a correspondence document when the user has permission to edit', () => {
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
          messageViewerDocumentToDisplay: {
            documentId: '567',
          },
        },
      });

      expect(result.showEditCorrespondenceButton).toBeTruthy();
    });

    it('returns false for a correspondence document when the user does not have permission to edit', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(petitionerUser),
          caseDetail: {
            ...baseCaseDetail,
            correspondence: [
              {
                correspondenceId: '567',
                documentTitle: 'Test Correspondence',
              },
            ],
          },
          messageViewerDocumentToDisplay: {
            documentId: '567',
          },
        },
      });

      expect(result.showEditCorrespondenceButton).toBeFalsy();
    });

    it('return showEditCorrespondenceButton false for a non-correspondence document', () => {
      const result = runCompute(messageDocumentHelper, {
        state: getBaseState(docketClerkUser),
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
        },
      });

      expect(result.showDocumentNotSignedAlert).toEqual(true);
    });
  });

  describe('serving documents', () => {
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
                  ...baseDocketEntry,
                  eventCode: 'PMT',
                },
              ],
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
            ],
          },
          permissions: { SERVE_DOCUMENT: false },
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
          messageViewerDocumentToDisplay: {
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
        },
      });

      expect(result.showSignStipulatedDecisionButton).toEqual(false);
    });

    it('should be false if the user is an external user, the eventCode is PSDE, the PSDE is served, and the SDEC event code is not in the documents', () => {
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
          messageViewerDocumentToDisplay: {
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
          messageViewerDocumentToDisplay: {
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
          messageViewerDocumentToDisplay: {
            documentId: '456',
          },
        },
      });

      expect(archived).toBeFalsy();
    });

    it('should be false when the document is not an archived document', () => {
      const { archived } = runCompute(messageDocumentHelper, {
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
        },
      });

      expect(archived).toBeFalsy();
    });
  });

  it('should return generated links', () => {
    const result = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          ...baseCaseDetail,
        },
      },
    });

    expect(result.addDocketEntryLink).toEqual(
      `/case-detail/${baseCaseDetail.docketNumber}/documents/${mockDocumentId}/add-court-issued-docket-entry/${mockParentMessageId}`,
    );
    expect(result.editCorrespondenceLink).toEqual(
      `/case-detail/${baseCaseDetail.docketNumber}/edit-correspondence/${mockDocumentId}/${mockParentMessageId}`,
    );
    expect(result.messageDetailLink).toEqual(
      `/messages/${baseCaseDetail.docketNumber}/message-detail/${mockParentMessageId}`,
    );
    expect(result.servePetitionLink).toEqual(
      `/case-detail/${baseCaseDetail.docketNumber}/petition-qc/${mockParentMessageId}`,
    );
    expect(result.signOrderLink).toEqual(
      `/case-detail/${baseCaseDetail.docketNumber}/edit-order/${mockDocumentId}/sign/${mockParentMessageId}`,
    );
  });
});
