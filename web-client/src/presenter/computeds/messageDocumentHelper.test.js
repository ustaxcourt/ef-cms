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
  it('return showAddDocketEntryButton true for user role of docketClerk and a document that is not on the docket record', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          correspondence: [],
          docketRecord: [],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              isDraft: true,
            },
          ],
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
          correspondence: [],
          docketRecord: [],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              isDraft: true,
            },
          ],
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
          correspondence: [],
          docketRecord: [],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              isDraft: true,
            },
          ],
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
          correspondence: [],
          docketRecord: [
            {
              documentId: '123',
            },
          ],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              isDraft: false,
            },
          ],
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
          correspondence: [],
          docketRecord: [
            {
              documentId: '123',
            },
          ],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              isDraft: false,
            },
          ],
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
          correspondence: [],
          docketRecord: [
            {
              documentId: '123',
            },
          ],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              isDraft: false,
            },
          ],
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
          correspondence: [],
          docketRecord: [],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              isDraft: true,
            },
          ],
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
          correspondence: [
            {
              documentId: '567',
              documentTitle: 'Test Correspondence',
            },
          ],
          docketRecord: [],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              isDraft: true,
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

  it('return showApplySignatureButton true and showRemoveSignatureButton false for an internal user and an unsigned document that is not on the docket record', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          correspondence: [],
          docketRecord: [],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              isDraft: true,
            },
          ],
        },
        viewerDocumentToDisplay: {
          documentId: '123',
        },
      },
    });

    expect(result.showApplySignatureButton).toEqual(true);
    expect(result.showRemoveSignatureButton).toEqual(false);
  });

  it('return showRemoveSignatureButton true and showApplySignatureButton false for an internal user and a signed document that is not on the docket record', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          correspondence: [],
          docketRecord: [],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
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

    expect(result.showRemoveSignatureButton).toEqual(true);
    expect(result.showApplySignatureButton).toEqual(false);
  });

  it('return showApplySignatureButton false and showRemoveSignatureButton false for an external user and an unsigned document that is not on the docket record', () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    const result = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: {
          correspondence: [],
          docketRecord: [],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              isDraft: true,
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

  it('return showRemoveSignatureButton false and showApplySignatureButton false for an external user and a signed document that is not on the docket record', () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    const result = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: {
          correspondence: [],
          docketRecord: [],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
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

    expect(result.showRemoveSignatureButton).toEqual(false);
    expect(result.showApplySignatureButton).toEqual(false);
  });

  it('return showApplySignatureButton false and showRemoveSignatureButton false for an unsigned document that is already on the docket record', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          correspondence: [],
          docketRecord: [
            {
              documentId: '123',
            },
          ],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              isDraft: false,
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

  it('return showRemoveSignatureButton false and showApplySignatureButton false for a signed document that is alreay on the docket record', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          correspondence: [],
          docketRecord: [
            {
              documentId: '123',
            },
          ],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
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
          correspondence: [],
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Notice',
              documentType: 'Notice',
              eventCode: 'NOT',
              isDraft: true,
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
          correspondence: [],
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Notice',
              documentType: 'Notice',
              eventCode: 'NTD',
              isDraft: true,
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
          correspondence: [
            {
              documentId: '567',
              documentTitle: 'Test Correspondence',
            },
          ],
          docketRecord: [],
          documents: [
            {
              documentId: '123',
              isDraft: true,
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

  it('return showEditButtonSigned true for an internal user and a document that is not on the docket record and is signed', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          correspondence: [],
          docketRecord: [],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              isDraft: true,
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

  it('return showEditButtonNotSigned true for an internal user and a document that is not on the docket record and is not signed', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          correspondence: [],
          docketRecord: [],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              isDraft: true,
            },
          ],
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
          correspondence: [
            {
              documentId: '567',
              documentTitle: 'Test Correspondence',
              isDraft: true,
            },
          ],
          docketRecord: [],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
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
          correspondence: [],
          docketRecord: [],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              isDraft: true,
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

  it('return showEditButtonSigned false for an internal user and a document that is already on the docket record', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          correspondence: [],
          docketRecord: [
            {
              documentId: '123',
            },
          ],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              isDraft: false,
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

  it('return showEditButtonNotSigned true and showEditButtonSigned false for Notice document', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          correspondence: [],
          docketRecord: [
            {
              documentId: '123',
            },
          ],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              eventCode: 'NOT',
              isDraft: true,
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

  it('return showEditCorrespondenceButton true for a correspondence document', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          correspondence: [
            {
              documentId: '567',
              documentTitle: 'Test Correspondence',
            },
          ],
          docketRecord: [],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              isDraft: true,
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
          correspondence: [],
          docketRecord: [
            {
              documentId: '123',
            },
          ],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              isDraft: true,
            },
          ],
        },
        viewerDocumentToDisplay: {
          documentId: '123',
        },
      },
    });

    expect(result.showEditCorrespondenceButton).toEqual(false);
  });

  it('should return showDocumentNotSignedAlert false if document is not signed and the event code does not require a signature', () => {
    const result = runCompute(messageDocumentHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          correspondence: [],
          docketRecord: [
            {
              documentId: '123',
            },
          ],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
              eventCode: 'MISC', // Does not require a signature
              isDraft: true,
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
          correspondence: [],
          docketRecord: [
            {
              documentId: '123',
            },
          ],
          documents: [
            {
              documentId: '123',
              entityName: 'Document',
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

  describe('serving documents', () => {
    beforeEach(() => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);
    });

    it('should set showNotServed to true when the document is servable, unserved, and not a draft document', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            correspondence: [],
            docketRecord: [
              {
                documentId: '123',
              },
            ],
            documents: [
              {
                documentId: '123',
                entityName: 'Document',
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

      expect(result.showNotServed).toBe(true);
    });

    it('should set showServeCourtIssuedDocumentButton to true when the document is a servable court issued document that is unserved, and not a draft document', () => {
      const result = runCompute(messageDocumentHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            correspondence: [],
            docketRecord: [
              {
                documentId: '123',
              },
            ],
            documents: [
              {
                documentId: '123',
                documentType: 'Order',
                entityName: 'Document',
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
            correspondence: [],
            docketRecord: [
              {
                documentId: '123',
              },
            ],
            documents: [
              {
                documentId: '123',
                documentType: 'Order',
                entityName: 'Document',
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
            correspondence: [],
            docketRecord: [
              {
                documentId: '123',
              },
            ],
            documents: [
              {
                documentId: '123',
                documentType: 'Answer',
                entityName: 'Document',
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
            correspondence: [],
            docketRecord: [
              {
                documentId: '123',
              },
            ],
            documents: [
              {
                documentId: '123',
                documentType: 'Answer',
                entityName: 'Document',
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
            correspondence: [],
            docketRecord: [
              {
                documentId: '123',
              },
              {
                documentId: '456',
              },
            ],
            documents: [
              {
                documentId: '123',
                documentType: 'Answer',
                entityName: 'Document',
                eventCode: 'A', // paper filed document type
                isDraft: false,
              },
              {
                documentId: '456',
                documentType: 'Order',
                entityName: 'Document',
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
            correspondence: [],
            docketRecord: [
              {
                documentId: '123',
              },
            ],
            documents: [
              {
                documentId: '123',
                documentType: 'Petition',
                entityName: 'Document',
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
            correspondence: [],
            docketRecord: [
              {
                documentId: '123',
              },
            ],
            documents: [
              {
                documentId: '123',
                documentType: 'Petition',
                entityName: 'Document',
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
            correspondence: [],
            docketRecord: [
              {
                documentId: '123',
              },
            ],
            documents: [
              {
                documentId: '123',
                documentType: 'Petition',
                entityName: 'Document',
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
            correspondence: [],
            docketRecord: [],
            documents: [
              {
                documentId: '123',
                documentType: 'Miscellaneous',
                entityName: 'Document',
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
            correspondence: [],
            docketRecord: [],
            documents: [
              {
                documentId: '123',
                documentType: 'Miscellaneous',
                entityName: 'Document',
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
});
