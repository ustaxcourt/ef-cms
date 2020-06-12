import { createCaseMessageModalHelper } from './createCaseMessageModalHelper';
import { runCompute } from 'cerebral/test';

describe('createCaseMessageModalHelper', () => {
  const formattedCaseDetail = {
    docketRecordWithDocument: [],
    draftDocuments: [],
  };

  it('returns documents on the docket record', () => {
    const result = runCompute(createCaseMessageModalHelper, {
      state: {
        formattedCaseDetail: {
          docketRecordWithDocument: [
            { document: { documentId: '123' } },
            { document: { documentId: '234' } },
          ],
          draftDocuments: [],
        },
        modal: {
          form: {},
        },
        screenMetadata: {
          showAddDocumentForm: true,
        },
      },
    });

    expect(result.documents).toEqual([
      { documentId: '123' },
      { documentId: '234' },
    ]);
  });

  it('returns only documents from the docket record that have a document object', () => {
    const result = runCompute(createCaseMessageModalHelper, {
      state: {
        formattedCaseDetail: {
          docketRecordWithDocument: [
            { document: { documentId: '123' } },
            { document: undefined },
          ],
          draftDocuments: [],
        },
        modal: {
          form: {},
        },
        screenMetadata: {
          showAddDocumentForm: true,
        },
      },
    });

    expect(result.documents).toEqual([{ documentId: '123' }]);
  });

  it('returns draftDocuments from formattedCaseDetail', () => {
    const result = runCompute(createCaseMessageModalHelper, {
      state: {
        formattedCaseDetail: {
          docketRecordWithDocument: [],
          draftDocuments: [{ documentId: '123' }, { documentId: '234' }],
        },
        modal: {
          form: {},
        },
        screenMetadata: {
          showAddDocumentForm: true,
        },
      },
    });

    expect(result.draftDocuments).toEqual([
      { documentId: '123' },
      { documentId: '234' },
    ]);
  });

  it('returns showAddDocumentForm true when the current attachment count is zero', () => {
    const result = runCompute(createCaseMessageModalHelper, {
      state: {
        formattedCaseDetail,
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
    const result = runCompute(createCaseMessageModalHelper, {
      state: {
        formattedCaseDetail,
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
    const result = runCompute(createCaseMessageModalHelper, {
      state: {
        formattedCaseDetail,
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
    const result = runCompute(createCaseMessageModalHelper, {
      state: {
        formattedCaseDetail,
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
    const result = runCompute(createCaseMessageModalHelper, {
      state: {
        formattedCaseDetail,
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
    const result = runCompute(createCaseMessageModalHelper, {
      state: {
        formattedCaseDetail,
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
});
