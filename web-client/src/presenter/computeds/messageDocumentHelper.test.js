import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { messageDocumentHelper as messageDocumentHeperComputed } from './messageDocumentHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';
const { USER_ROLES } = applicationContext.getConstants();

const messageDocumentHelper = withAppContextDecorator(
  messageDocumentHeperComputed,
  applicationContext,
);

describe('messageDocumentHelper', () => {
  it('return showAddDocketEntryButton true for user role of docketClerk and a document that is not on the docket record', () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.docketClerk,
    });

    const result = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: '123',
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
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.petitionsClerk,
    });

    const result = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: '123',
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
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.clerkOfCourt,
    });

    const result = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: '123',
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
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.docketClerk,
    });

    const result = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketRecord: [
            {
              documentId: '123',
            },
          ],
          documents: [
            {
              documentId: '123',
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
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.petitionsClerk,
    });

    const result = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketRecord: [
            {
              documentId: '123',
            },
          ],
          documents: [
            {
              documentId: '123',
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
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.clerkOfCourt,
    });

    const result = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketRecord: [
            {
              documentId: '123',
            },
          ],
          documents: [
            {
              documentId: '123',
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
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.judge,
    });

    const result = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: '123',
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

  it('return showApplySignatureButton true and showEditSignatureButton false for an internal user and an unsigned document that is not on the docket record', () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.docketClerk,
    });

    const result = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: '123',
            },
          ],
        },
        viewerDocumentToDisplay: {
          documentId: '123',
        },
      },
    });

    expect(result.showApplySignatureButton).toEqual(true);
    expect(result.showEditSignatureButton).toEqual(false);
  });

  it('return showEditSignatureButton true and showApplySignatureButton false for an internal user and a signed document that is not on the docket record', () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.docketClerk,
    });

    const result = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: '123',
              signedAt: '2020-06-25T20:49:28.192Z',
            },
          ],
        },
        viewerDocumentToDisplay: {
          documentId: '123',
        },
      },
    });

    expect(result.showEditSignatureButton).toEqual(true);
    expect(result.showApplySignatureButton).toEqual(false);
  });

  it('return showApplySignatureButton false and showEditSignatureButton false for an external user and an unsigned document that is not on the docket record', () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.petitioner,
    });

    const result = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: '123',
            },
          ],
        },
        viewerDocumentToDisplay: {
          documentId: '123',
        },
      },
    });

    expect(result.showApplySignatureButton).toEqual(false);
    expect(result.showEditSignatureButton).toEqual(false);
  });

  it('return showEditSignatureButton false and showApplySignatureButton false for an external user and a signed document that is not on the docket record', () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.petitioner,
    });

    const result = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: '123',
              signedAt: '2020-06-25T20:49:28.192Z',
            },
          ],
        },
        viewerDocumentToDisplay: {
          documentId: '123',
        },
      },
    });

    expect(result.showEditSignatureButton).toEqual(false);
    expect(result.showApplySignatureButton).toEqual(false);
  });

  it('return showApplySignatureButton false and showEditSignatureButton false for an unsigned document that is already on the docket record', () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.docketClerk,
    });

    const result = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketRecord: [
            {
              documentId: '123',
            },
          ],
          documents: [
            {
              documentId: '123',
            },
          ],
        },
        viewerDocumentToDisplay: {
          documentId: '123',
        },
      },
    });

    expect(result.showApplySignatureButton).toEqual(false);
    expect(result.showEditSignatureButton).toEqual(false);
  });

  it('return showEditSignatureButton false and showApplySignatureButton false for a signed document that is alreay on the docket record', () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.docketClerk,
    });

    const result = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketRecord: [
            {
              documentId: '123',
            },
          ],
          documents: [
            { documentId: '123', signedAt: '2020-06-25T20:49:28.192Z' },
          ],
        },
        viewerDocumentToDisplay: {
          documentId: '123',
        },
      },
    });

    expect(result.showEditSignatureButton).toEqual(false);
    expect(result.showApplySignatureButton).toEqual(false);
  });

  it('return showEditButtonSigned true for an internal user and a document that is not on the docket record and is signed', () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.docketClerk,
    });

    const result = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: '123',
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
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.docketClerk,
    });

    const result = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: '123',
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

  it('return showEditButtonSigned false for an external user and a document that is not on the docket record', () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.petitioner,
    });

    const result = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketRecord: [],
          documents: [
            {
              documentId: '123',
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
    applicationContext.getCurrentUser.mockReturnValue({
      role: USER_ROLES.docketClerk,
    });

    const result = runCompute(messageDocumentHelper, {
      state: {
        caseDetail: {
          docketRecord: [
            {
              documentId: '123',
            },
          ],
          documents: [
            {
              documentId: '123',
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
});
