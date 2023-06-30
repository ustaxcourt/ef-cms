import { applicationContext } from '../../applicationContext';
import {
  clerkOfCourtUser,
  docketClerkUser,
  judgeUser,
  petitionerUser,
  petitionsClerkUser,
} from '../../../../shared/src/test/mockUsers';
import { draftDocumentViewerHelper as draftDocumentViewerHelperComputed } from './draftDocumentViewerHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../src/withAppContext';

const draftDocumentViewerHelper = withAppContextDecorator(
  draftDocumentViewerHelperComputed,
  applicationContext,
);

describe('draftDocumentViewerHelper', () => {
  const mockDocketEntryId = 'e2cfaab4-7ca0-4fda-a03b-96145bc0d68e';
  const mockDocketNumber = '101-20';

  const getBaseState = user => {
    return {
      permissions: getUserPermissions(user),
      viewerDraftDocumentToDisplay: {
        docketEntryId: mockDocketEntryId,
      },
    };
  };

  const baseDraftDocketEntry = {
    docketEntryId: mockDocketEntryId,
    documentTitle: 'Order to do something',
    documentType: 'Order',
    eventCode: 'O',
    filedBy: 'Test Petitionsclerk',
    isDraft: true,
  };

  beforeAll(() => {
    applicationContext.getCurrentUser = jest
      .fn()
      .mockReturnValue(docketClerkUser);
  });

  it('should return an object with empty strings if viewerDraftDocumentToDisplay.eventCode is not defined', () => {
    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [{}],
        },
      },
    });
    expect(result).toEqual({
      createdByLabel: '',
      documentTitle: '',
    });
  });

  it('should return the document title', () => {
    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDraftDocketEntry],
        },
      },
    });
    expect(result.documentTitle).toEqual('Order to do something');
  });

  it('should return the created by label', () => {
    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDraftDocketEntry],
        },
      },
    });
    expect(result.createdByLabel).toEqual('Created by Test Petitionsclerk');
  });

  it('should return an empty string for the created by label if filedBy is empty', () => {
    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDraftDocketEntry,
              filedBy: undefined,
            },
          ],
        },
      },
    });
    expect(result.createdByLabel).toEqual('');
  });

  it('should return empty strings if the provided docketEntryId is not found in draft documents', () => {
    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDraftDocketEntry],
        },
        viewerDraftDocumentToDisplay: {
          docketEntryId: '123',
        },
      },
    });
    expect(result).toEqual({ createdByLabel: '', documentTitle: '' });
  });

  describe('showAddDocketEntryButton', () => {
    it('should return true for user role of petitionsClerk', () => {
      applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

      const result = runCompute(draftDocumentViewerHelper, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDraftDocketEntry,
                signedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
        },
      });

      expect(result.showAddDocketEntryButton).toEqual(true);
    });

    it('should return true for user role of clerkOfCourt', () => {
      applicationContext.getCurrentUser.mockReturnValue(clerkOfCourtUser);

      const result = runCompute(draftDocumentViewerHelper, {
        state: {
          ...getBaseState(clerkOfCourtUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDraftDocketEntry,
                signedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
        },
      });

      expect(result.showAddDocketEntryButton).toEqual(true);
    });

    it('should return false for other internal user roles', () => {
      applicationContext.getCurrentUser.mockReturnValue(judgeUser);

      const result = runCompute(draftDocumentViewerHelper, {
        state: {
          ...getBaseState(judgeUser),
          caseDetail: {
            docketEntries: [baseDraftDocketEntry],
          },
        },
      });

      expect(result.showAddDocketEntryButton).toEqual(false);
    });

    it('should return true for signed document', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(draftDocumentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [
              {
                ...baseDraftDocketEntry,
                signedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
          },
        },
      });

      expect(result.showAddDocketEntryButton).toEqual(true);
    });

    it('should return false for unsigned document that requires signature', () => {
      applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

      const result = runCompute(draftDocumentViewerHelper, {
        state: {
          ...getBaseState(docketClerkUser),
          caseDetail: {
            docketEntries: [baseDraftDocketEntry],
          },
        },
      });

      expect(result.showAddDocketEntryButton).toEqual(false);
    });
  });

  it('should return showApplySignatureButton true and showRemoveSignatureButton false for an internal user and an unsigned document', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDraftDocketEntry],
        },
      },
    });

    expect(result.showApplySignatureButton).toEqual(true);
    expect(result.showRemoveSignatureButton).toEqual(false);
  });

  it('should return showApplySignatureButton false and showRemoveSignatureButton false for an external user', () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: {
          docketEntries: [baseDraftDocketEntry],
        },
      },
    });

    expect(result.showApplySignatureButton).toEqual(false);
    expect(result.showRemoveSignatureButton).toEqual(false);
  });

  it('should return showRemoveSignatureButton true and showApplySignatureButton false for an internal user and a signed document that is not a draft stamp order', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDraftDocketEntry,
              signedAt: '2020-06-25T20:49:28.192Z',
              stampData: undefined,
            },
          ],
        },
      },
    });

    expect(result.showRemoveSignatureButton).toEqual(true);
    expect(result.showApplySignatureButton).toEqual(false);
  });

  it('should return showRemoveSignatureButton false for NOT document type and internal users', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDraftDocketEntry,
              documentTitle: 'Notice',
              documentType: 'Notice',
              eventCode: 'NOT',
              signedAt: '2020-06-25T20:49:28.192Z',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          docketEntryId: mockDocketEntryId,
          eventCode: 'NOT',
        },
      },
    });

    expect(result.showRemoveSignatureButton).toEqual(false);
  });

  it('should return showRemoveSignatureButton false for NTD document type and internal users', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDraftDocketEntry,
              documentTitle: 'Notice',
              documentType: 'Notice',
              eventCode: 'NTD',
              signedAt: '2020-06-25T20:49:28.192Z',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          docketEntryId: mockDocketEntryId,
          eventCode: 'NTD',
        },
      },
    });

    expect(result.showRemoveSignatureButton).toEqual(false);
  });

  it('should return showRemoveSignatureButton false for SDEC document type and internal users', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDraftDocketEntry,
              documentTitle: 'Stipulated Decision',
              documentType: 'Stipulated Decision',
              eventCode: 'SDEC',
              signedAt: '2020-06-25T20:49:28.192Z',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          docketEntryId: mockDocketEntryId,
          eventCode: 'SDEC',
        },
      },
    });

    expect(result.showRemoveSignatureButton).toEqual(false);
  });

  it('should return showRemoveSignatureButton false for a draft stamp order', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDraftDocketEntry,
              stampData: { disposition: 'some disposition' },
            },
          ],
        },
      },
    });

    expect(result.showRemoveSignatureButton).toEqual(false);
  });

  it('should return showEditButtonSigned true for an internal user, a document that is signed, and is not a draft stamp order', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDraftDocketEntry,
              signedAt: '2020-06-25T20:49:28.192Z',
              stampData: undefined,
            },
          ],
        },
      },
    });

    expect(result.showEditButtonSigned).toEqual(true);
  });

  it('should return showEditButtonNotSigned true for an internal user and a document that is not signed', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [baseDraftDocketEntry],
        },
      },
    });

    expect(result.showEditButtonNotSigned).toEqual(true);
  });

  it('should return showEditButtonSigned false for an external user', () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: {
          docketEntries: [baseDraftDocketEntry],
        },
      },
    });

    expect(result.showEditButtonSigned).toEqual(false);
  });

  it('should return showEditButtonSigned false for a draft stamp order', () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDraftDocketEntry,
              stampData: { disposition: 'some disposition' },
            },
          ],
        },
      },
    });

    expect(result.showEditButtonSigned).toEqual(false);
  });

  it('should return showEditButtonNotSigned true and showEditButtonSigned false for a Notice document', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDraftDocketEntry,
              documentTitle: 'Notice',
              documentType: 'NOT',
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

  it('should return showEditButtonNotSigned false and showEditButtonSigned false for a Stipulated Decision document', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketEntries: [
            {
              ...baseDraftDocketEntry,
              documentTitle: 'Stipulated Decision',
              documentType: 'Stipulated Decision',
              eventCode: 'SDEC',
              signedAt: '2020-06-25T20:49:28.192Z',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          docketEntryId: mockDocketEntryId,
          eventCode: 'SDEC',
        },
      },
    });

    expect(result.showEditButtonNotSigned).toEqual(false);
    expect(result.showEditButtonSigned).toEqual(false);
  });

  it('should return showDocumentNotSignedAlert false if document is not signed and the event code does not require a signature', () => {
    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: {
          docketEntries: [{ ...baseDraftDocketEntry, eventCode: 'MISC' }],
        },
        viewerDraftDocumentToDisplay: {
          docketEntryId: mockDocketEntryId,
          eventCode: 'MISC', // Does not require a signature
        },
      },
    });

    expect(result.showDocumentNotSignedAlert).toEqual(false);
  });

  it('should return showDocumentNotSignedAlert true if document is not signed but the event code requires a signature', () => {
    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: {
          docketEntries: [baseDraftDocketEntry],
        },
        viewerDraftDocumentToDisplay: {
          docketEntryId: mockDocketEntryId,
          eventCode: 'O',
        },
      },
    });

    expect(result.showDocumentNotSignedAlert).toEqual(true);
  });

  it('should return showDocumentNotSignedAlert true if document is not signed but the event code requires a signature and viewerDraftDocumentToDisplay only contains a docketEntryId', () => {
    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: {
          docketEntries: [baseDraftDocketEntry],
        },
      },
    });

    expect(result.showDocumentNotSignedAlert).toEqual(true);
  });

  it('should return addDocketEntryLink with docketNumer and viewerDraftDocumentToDisplay.docketEntryId', () => {
    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          docketEntries: [baseDraftDocketEntry],
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(result.addDocketEntryLink).toEqual(
      `/case-detail/${mockDocketNumber}/documents/${mockDocketEntryId}/add-court-issued-docket-entry`,
    );
  });

  it('should return applySignatureLink with docketNumber and viewerDraftDocumentToDisplay.docketEntryId', () => {
    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          docketEntries: [baseDraftDocketEntry],
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(result.applySignatureLink).toEqual(
      `/case-detail/${mockDocketNumber}/edit-order/${mockDocketEntryId}/sign`,
    );
  });
});
