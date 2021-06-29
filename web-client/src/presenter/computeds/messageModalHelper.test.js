import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { messageModalHelper as messageModalHelperComputed } from './messageModalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const messageModalHelper = withAppContextDecorator(
  messageModalHelperComputed,
  applicationContext,
);

describe('messageModalHelper', () => {
  let caseDetail;

  beforeAll(() => {
    applicationContext.getCurrentUser = () => ({
      userId: '2db2d514-cc08-4900-a2fc-6113abdc43e8',
    });

    caseDetail = {
      ...MOCK_CASE,
      correspondence: [
        {
          correspondenceId: '986',
          documentTitle: 'Test Correspondence',
        },
      ],
      docketEntries: [
        {
          documentId: '123',
          documentType: 'Petition',
          index: 1,
          isFileAttached: true,
          isOnDocketRecord: true,
        },
        {
          documentId: '234',
          documentTitle: 'Some Document',
          index: 2,
          isFileAttached: true,
          isOnDocketRecord: true,
        },
        { index: 3, isOnDocketRecord: true },
        { documentId: '345', documentType: 'Order', isDraft: true },
      ],
    };
  });

  it('returns documents on the docket record', () => {
    const result = runCompute(messageModalHelper, {
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
    const result = runCompute(messageModalHelper, {
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
      { correspondenceId: '986', documentTitle: 'Test Correspondence' },
    ]);
  });

  it('returns draftDocuments from formattedCaseDetail', () => {
    const result = runCompute(messageModalHelper, {
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
    const result = runCompute(messageModalHelper, {
      state: {
        caseDetail: {
          ...caseDetail,
          correspondence: [{ correspondenceId: '123' }],
          docketEntries: [],
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
    const result = runCompute(messageModalHelper, {
      state: {
        caseDetail: {
          ...caseDetail,
          correspondence: [],
          docketEntries: [],
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

  it('returns hasDocuments true when there are docketEntries with files attached on the case', () => {
    const result = runCompute(messageModalHelper, {
      state: {
        caseDetail: {
          ...caseDetail,
          correspondence: [],
          docketEntries: [
            {
              documentId: '123',
              index: 1,
              isDraft: true,
              isFileAttached: true,
              isOnDocketRecord: true,
            },
          ],
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

  it('returns hasDocuments false when there are NO docketEntries on the case', () => {
    const result = runCompute(messageModalHelper, {
      state: {
        caseDetail: {
          ...caseDetail,
          correspondence: [],
          docketEntries: [],
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
    const result = runCompute(messageModalHelper, {
      state: {
        caseDetail: {
          ...caseDetail,
          correspondence: [],
          docketEntries: [
            { documentId: '123', documentType: 'Order', isDraft: true },
          ],
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
    const result = runCompute(messageModalHelper, {
      state: {
        caseDetail: {
          ...caseDetail,
          correspondence: [{ correspondenceId: '234' }],
          docketEntries: [
            {
              documentId: '123',
              documentType: 'Order',
              index: 1,
              isOnDocketRecord: true,
            },
          ],
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
    const result = runCompute(messageModalHelper, {
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
    const result = runCompute(messageModalHelper, {
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
    const result = runCompute(messageModalHelper, {
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
    const result = runCompute(messageModalHelper, {
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
    const result = runCompute(messageModalHelper, {
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
    const result = runCompute(messageModalHelper, {
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
    const result = runCompute(messageModalHelper, {
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
    const result = runCompute(messageModalHelper, {
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

  it('populates documents from formattedDocketEntries and sets a title on each entry', () => {
    const mockFormattedDocketEntries = [
      {
        descriptionDisplay: 'Hello with additional info',
        isFileAttached: true,
        isOnDocketRecord: true,
      },
      {
        documentType: 'Hello documentType',
        isFileAttached: true,
        isOnDocketRecord: true,
      },
    ];

    applicationContext.getUtilities().getFormattedCaseDetail.mockReturnValue({
      draftDocuments: [],
      formattedDocketEntries: mockFormattedDocketEntries,
    });

    const result = runCompute(messageModalHelper, {
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

    expect(result.documents).toEqual(mockFormattedDocketEntries);
    expect(result.documents[0].title).toEqual(
      mockFormattedDocketEntries[0].descriptionDisplay,
    );
    expect(result.documents[1].title).toEqual(
      mockFormattedDocketEntries[1].documentType,
    );
  });

  it('should set a title on draftDocuments from the documentTitle or documentType', () => {
    const mockDraftDocuments = [
      {
        documentTitle: 'Order to do something',
      },
      {
        documentType: 'Hello documentType',
      },
    ];

    applicationContext.getUtilities().getFormattedCaseDetail.mockReturnValue({
      draftDocuments: mockDraftDocuments,
      formattedDocketEntries: [],
    });

    const result = runCompute(messageModalHelper, {
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

    expect(result.draftDocuments).toMatchObject([
      {
        documentTitle: 'Order to do something',
        title: 'Order to do something',
      },
      {
        documentType: 'Hello documentType',
        title: 'Hello documentType',
      },
    ]);
  });
});
