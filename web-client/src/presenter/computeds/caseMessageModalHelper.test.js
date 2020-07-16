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
      correspondence: [
        {
          documentId: '986',
          documentTitle: 'Test Correspondence',
        },
      ],
      docketRecord: [
        { documentId: '123', index: 1 },
        { documentId: '234', index: 2 },
        { index: 3 }, // note: no document
      ],
      documents: [
        {
          documentId: '123',
          documentType: 'Petition',
          isFileAttached: true,
        },
        {
          documentId: '234',
          documentTitle: 'Some Document',
          isFileAttached: true,
        },
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

  it('returns correspondence from formattedCaseDetail', () => {
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

    expect(result.correspondence).toMatchObject([
      { documentId: '986', documentTitle: 'Test Correspondence' },
    ]);
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

  it('returns hasCorrespondence true when there are correspondence documents on the case', () => {
    const result = runCompute(caseMessageModalHelper, {
      state: {
        caseDetail: {
          correspondence: [{ documentId: '123' }],
          documents: [],
        },
        modal: {
          form: {},
        },
        screenMetadata: {
          showAddDocumentForm: true,
        },
      },
    });

    expect(result.hasCorrespondence).toEqual(true);
  });

  it('returns hasCorrespondence false when there are NO correspondence documents on the case', () => {
    const result = runCompute(caseMessageModalHelper, {
      state: {
        caseDetail: {
          correspondence: [],
          documents: [],
        },
        modal: {
          form: {},
        },
        screenMetadata: {
          showAddDocumentForm: true,
        },
      },
    });

    expect(result.hasDocuments).toEqual(false);
  });

  it('returns hasDocuments true when there are documents with files attached on the case', () => {
    const result = runCompute(caseMessageModalHelper, {
      state: {
        caseDetail: {
          correspondence: [],
          docketRecord: [{ documentId: '123', index: 1 }],
          documents: [{ documentId: '123', isFileAttached: true }],
        },
        modal: {
          form: {},
        },
        screenMetadata: {
          showAddDocumentForm: true,
        },
      },
    });

    expect(result.hasDocuments).toEqual(true);
  });

  it('returns hasDocuments false when there are NO documents on the case', () => {
    const result = runCompute(caseMessageModalHelper, {
      state: {
        caseDetail: {
          correspondence: [],
          docketRecord: [],
          documents: [],
        },
        modal: {
          form: {},
        },
        screenMetadata: {
          showAddDocumentForm: true,
        },
      },
    });

    expect(result.hasCorrespondence).toEqual(false);
  });

  it('returns hasDraftDocuments true when there are draft documents on the case', () => {
    const result = runCompute(caseMessageModalHelper, {
      state: {
        caseDetail: {
          correspondence: [],
          docketRecord: [],
          documents: [{ documentId: '123', documentType: 'Order' }],
        },
        modal: {
          form: {},
        },
        screenMetadata: {
          showAddDocumentForm: true,
        },
      },
    });

    expect(result.hasDraftDocuments).toEqual(true);
  });

  it('returns hasDraftDocuments false when there are NO draft documents on the case', () => {
    const result = runCompute(caseMessageModalHelper, {
      state: {
        caseDetail: {
          correspondence: [{ documentId: '234' }],
          docketRecord: [{ documentId: '123', index: 1 }],
          documents: [{ documentId: '123', documentType: 'Order' }],
        },
        modal: {
          form: {},
        },
        screenMetadata: {
          showAddDocumentForm: true,
        },
      },
    });

    expect(result.hasDraftDocuments).toEqual(false);
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
