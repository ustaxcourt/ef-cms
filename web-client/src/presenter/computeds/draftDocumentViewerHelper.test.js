import { applicationContext } from '../../applicationContext';
import { draftDocumentViewerHelper as draftDocumentViewerHelperComputed } from './draftDocumentViewerHelper';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../src/withAppContext';
const { USER_ROLES } = applicationContext.getConstants();

const draftDocumentViewerHelper = withAppContextDecorator(
  draftDocumentViewerHelperComputed,
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

describe('draftDocumentViewerHelper', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser = jest
      .fn()
      .mockReturnValue(docketClerkUser);
  });

  it('should return the document title', () => {
    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order to do something',
              documentType: 'Order',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          documentId: 'abc',
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
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order to do something',
              documentType: 'Order',
              filedBy: 'Test Petitionsclerk',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          documentId: 'abc',
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
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order to do something',
              documentType: 'Order',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });
    expect(result.createdByLabel).toEqual('');
  });

  it('should return empty strings if the provided documentId is not found in draft documents', () => {
    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order to do something',
              documentType: 'Order',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          documentId: '123',
        },
      },
    });
    expect(result).toEqual({ createdByLabel: '', documentTitle: '' });
  });

  it('return showAddDocketEntryButton true for user role of docketClerk', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order to do something',
              documentType: 'Order',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });

    expect(result.showAddDocketEntryButton).toEqual(true);
  });

  it('return showAddDocketEntryButton true for user role of petitionsClerk', () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order to do something',
              documentType: 'Order',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });

    expect(result.showAddDocketEntryButton).toEqual(true);
  });

  it('return showAddDocketEntryButton true for user role of clerkOfCourt', () => {
    applicationContext.getCurrentUser.mockReturnValue(clerkOfCourtUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(clerkOfCourtUser),
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order to do something',
              documentType: 'Order',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });

    expect(result.showAddDocketEntryButton).toEqual(true);
  });

  it('return showAddDocketEntryButton false for other internal user roles', () => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(judgeUser),
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order to do something',
              documentType: 'Order',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });

    expect(result.showAddDocketEntryButton).toEqual(false);
  });

  it('return showApplySignatureButton true and showEditSignatureButton false for an internal user and an unsigned document', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order to do something',
              documentType: 'Order',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });

    expect(result.showApplySignatureButton).toEqual(true);
    expect(result.showEditSignatureButton).toEqual(false);
  });

  it('return showEditSignatureButton true and showApplySignatureButton false for an internal user and a signed document', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order to do something',
              documentType: 'Order',
              signedAt: '2020-06-25T20:49:28.192Z',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });

    expect(result.showEditSignatureButton).toEqual(true);
    expect(result.showApplySignatureButton).toEqual(false);
  });

  it('return showApplySignatureButton false and showEditSignatureButton false for an external user', () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order to do something',
              documentType: 'Order',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });

    expect(result.showApplySignatureButton).toEqual(false);
    expect(result.showEditSignatureButton).toEqual(false);
  });

  it('return showEditButtonSigned true for an internal user and a document that is signed', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order to do something',
              documentType: 'Order',
              signedAt: '2020-06-25T20:49:28.192Z',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });

    expect(result.showEditButtonSigned).toEqual(true);
  });

  it('return showEditButtonNotSigned true for an internal user and a document that is not signed', () => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(docketClerkUser),
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order to do something',
              documentType: 'Order',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });

    expect(result.showEditButtonNotSigned).toEqual(true);
  });

  it('return showEditButtonSigned false for an external user', () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    const result = runCompute(draftDocumentViewerHelper, {
      state: {
        ...getBaseState(petitionerUser),
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: 'abc',
              documentTitle: 'Order to do something',
              documentType: 'Order',
            },
          ],
        },
        viewerDraftDocumentToDisplay: {
          documentId: 'abc',
        },
      },
    });

    expect(result.showEditButtonSigned).toEqual(false);
  });
});
