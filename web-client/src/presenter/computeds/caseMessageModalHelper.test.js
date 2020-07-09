import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
import { caseMessageModalHelper as caseMessageModalHelperComputed } from './caseMessageModalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const caseMessageModalHelper = withAppContextDecorator(
  caseMessageModalHelperComputed,
  applicationContext,
);

describe('caseMessageModalHelper', () => {
  let caseDetail;

  beforeAll(() => {
    applicationContext.getCurrentUser = () => ({
      userId: MOCK_CASE.userId,
    });

    caseDetail = {
      ...MOCK_CASE,
      docketRecord: [
        { documentId: '123', index: 1 },
        { documentId: '234', index: 2 },
        { index: 3 }, // note: no document
      ],
      documents: [
        { documentId: '123', documentType: 'Petition' },
        { documentId: '234', documentTitle: 'Some Document' },
        { documentId: '345', documentType: 'Order' },
      ],
    };
  });

  it('returns documents on the docket record', () => {
    const result = runCompute(caseMessageModalHelper, {
      state: {
        caseDetail,
        modal: {
          form: {},
        },
        screenMetadata: {
          showAddDocumentForm: true,
        },
      },
    });

    expect(result.documents).toMatchObject([
      { documentId: '123' },
      { documentId: '234' },
    ]);
    expect(result.documents.length).toEqual(2);
  });

  it('returns draftDocuments from formattedCaseDetail', () => {
    const result = runCompute(caseMessageModalHelper, {
      state: {
        caseDetail,
        modal: {
          form: {},
        },
        screenMetadata: {
          showAddDocumentForm: true,
        },
      },
    });

    expect(result.draftDocuments).toMatchObject([{ documentId: '345' }]);
  });

  it('returns showAddDocumentForm true when the current attachment count is zero', () => {
    const result = runCompute(caseMessageModalHelper, {
      state: {
        caseDetail,
        modal: {
          form: {},
        },
        screenMetadata: {
          showAddDocumentForm: true,
        },
      },
    });

    expect(result.showAddDocumentForm).toEqual(true);
  });

  it('returns showAddDocumentForm true when screenMetadata.showAddDocumentForm is true and the maximum number of attachments has not been met', () => {
    const result = runCompute(caseMessageModalHelper, {
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [{}, {}, {}, {}], // 4/5 documents attached
          },
        },
        screenMetadata: {
          showAddDocumentForm: true,
        },
      },
    });

    expect(result.showAddDocumentForm).toEqual(true);
  });

  it('returns showAddDocumentForm false when screenMetadata.showAddDocumentForm is false and the maximum number of attachments has not been met', () => {
    const result = runCompute(caseMessageModalHelper, {
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [{}, {}, {}, {}], // 4/5 documents attached
          },
        },
        screenMetadata: {
          showAddDocumentForm: false,
        },
      },
    });

    expect(result.showAddDocumentForm).toEqual(false);
  });

  it('returns showAddDocumentForm false when maximum number of attachments have been reached', () => {
    const result = runCompute(caseMessageModalHelper, {
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [{}, {}, {}, {}, {}], // 5/5 documents attached
          },
        },
        screenMetadata: {
          showAddDocumentForm: true,
        },
      },
    });

    expect(result.showAddDocumentForm).toEqual(false);
  });

  it('returns showAddMoreDocumentsButton true when showAddDocumentForm is false and the current attachment count is greater than zero but less than the maximum', () => {
    const result = runCompute(caseMessageModalHelper, {
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [{}, {}, {}, {}], // 4/5 documents attached
          },
        },
        screenMetadata: {
          showAddDocumentForm: false,
        },
      },
    });

    expect(result.showAddMoreDocumentsButton).toEqual(true);
  });

  it('returns showAddMoreDocumentsButton false when maximum number of attachments have been reached', () => {
    const result = runCompute(caseMessageModalHelper, {
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [{}, {}, {}, {}, {}], // 5/5 documents attached
          },
        },
        screenMetadata: {
          showAddDocumentForm: false,
        },
      },
    });

    expect(result.showAddMoreDocumentsButton).toEqual(false);
  });

  it('returns showMessageAttachments true when the the form has message attachments', () => {
    const result = runCompute(caseMessageModalHelper, {
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [{}], // has at least one attachment
          },
        },
        screenMetadata: {
          showAddDocumentForm: false,
        },
      },
    });

    expect(result.showMessageAttachments).toEqual(true);
  });

  it('returns showMessageAttachments false when the the form has NO message attachments', () => {
    const result = runCompute(caseMessageModalHelper, {
      state: {
        caseDetail,
        modal: {
          form: {
            attachments: [], // no attachments on form
          },
        },
        screenMetadata: {
          showAddDocumentForm: false,
        },
      },
    });

    expect(result.showMessageAttachments).toEqual(false);
  });
});
