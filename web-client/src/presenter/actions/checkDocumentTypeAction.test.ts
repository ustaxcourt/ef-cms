import { checkDocumentTypeAction } from '@web-client/presenter/actions/checkDocumentTypeAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('checkDocumentTypeAction', () => {
  const pathDocumentTypeMiscellaneousStub = jest.fn();
  const pathDocumentTypeOrderStub = jest.fn();

  const mockDocketNumber = '123-45';
  const mockDocketEntryId = '67890';
  const mockParentMessageId = 'abcdef';
  const propsBase = {
    docketEntryIdToEdit: mockDocketEntryId,
  };

  const presenter = {
    providers: {
      path: {
        documentTypeMiscellaneous: pathDocumentTypeMiscellaneousStub,
        documentTypeOrder: pathDocumentTypeOrderStub,
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct path for Miscellaneous document type without parentMessageId', async () => {
    const props = {
      ...propsBase,
      caseDetail: {
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            documentType: 'Miscellaneous',
          },
        ],
        docketNumber: mockDocketNumber,
      },
    };

    await runAction(checkDocumentTypeAction, {
      modules: { presenter },
      props,
    });

    expect(pathDocumentTypeMiscellaneousStub).toHaveBeenCalledWith({
      path: `/case-detail/${mockDocketNumber}/edit-upload-court-issued/${mockDocketEntryId}`,
    });
  });

  it('should return the correct path for Miscellaneous document type with parentMessageId', async () => {
    const props = {
      ...propsBase,
      caseDetail: {
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            documentType: 'Miscellaneous',
          },
        ],
        docketNumber: mockDocketNumber,
      },

      documentType: 'Miscellaneous',
      parentMessageId: mockParentMessageId,
    };

    await runAction(checkDocumentTypeAction, {
      modules: { presenter },
      props,
    });

    expect(pathDocumentTypeMiscellaneousStub).toHaveBeenCalledWith({
      path: `/case-detail/${mockDocketNumber}/edit-upload-court-issued/${mockDocketEntryId}/${mockParentMessageId}`,
    });
  });

  it('should return the correct path for Order document type without parentMessageId', async () => {
    const props = {
      ...propsBase,
      caseDetail: {
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            documentType: 'Order',
          },
        ],
        docketNumber: mockDocketNumber,
      },
    };

    await runAction(checkDocumentTypeAction, {
      modules: { presenter },
      props,
    });

    expect(pathDocumentTypeOrderStub).toHaveBeenCalledWith({
      path: `/case-detail/${mockDocketNumber}/edit-order/${mockDocketEntryId}`,
    });
  });

  it('should return the correct path for Order document type with parentMessageId', async () => {
    const props = {
      ...propsBase,
      caseDetail: {
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            documentType: 'Order',
          },
        ],
        docketNumber: mockDocketNumber,
      },
      parentMessageId: mockParentMessageId,
    };

    await runAction(checkDocumentTypeAction, {
      modules: { presenter },
      props,
    });

    expect(pathDocumentTypeOrderStub).toHaveBeenCalledWith({
      path: `/case-detail/${mockDocketNumber}/edit-order/${mockDocketEntryId}/${mockParentMessageId}`,
    });
  });

  it('should return the correct path for a document that is not a status report order with an undefined document type without parentMessageId', async () => {
    const props = {
      ...propsBase,
      caseDetail: {
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
          },
        ],
        docketNumber: mockDocketNumber,
      },
    };

    await runAction(checkDocumentTypeAction, {
      modules: { presenter },
      props,
    });

    expect(pathDocumentTypeMiscellaneousStub).toHaveBeenCalledWith({
      path: `/case-detail/${mockDocketNumber}/edit-upload-court-issued/${mockDocketEntryId}`,
    });
  });

  it('should return the correct path for a document that is not a status report order with an undefined document type with parentMessageId', async () => {
    const props = {
      ...propsBase,
      caseDetail: {
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
          },
        ],
        docketNumber: mockDocketNumber,
      },
      parentMessageId: mockParentMessageId,
    };

    await runAction(checkDocumentTypeAction, {
      modules: { presenter },
      props,
    });

    expect(pathDocumentTypeMiscellaneousStub).toHaveBeenCalledWith({
      path: `/case-detail/${mockDocketNumber}/edit-upload-court-issued/${mockDocketEntryId}/${mockParentMessageId}`,
    });
  });

  it('should return the correct path for a document that is a status report order with an undefined document type without parentMessageId', async () => {
    const props = {
      ...propsBase,
      caseDetail: {
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            draftOrderState: { orderType: 'statusReport' },
          },
        ],
        docketNumber: mockDocketNumber,
      },
      docketEntryIdToEdit: propsBase.docketEntryIdToEdit,
    };

    await runAction(checkDocumentTypeAction, {
      modules: { presenter },
      props,
    });

    expect(pathDocumentTypeOrderStub).toHaveBeenCalledWith({
      path: `/case-detail/${mockDocketNumber}/edit-order/${mockDocketEntryId}`,
    });
  });

  it('should return the correct path for a document that is a status report order with an undefined document type with parentMessageId', async () => {
    const props = {
      ...propsBase,
      caseDetail: {
        docketEntries: [
          {
            docketEntryId: mockDocketEntryId,
            draftOrderState: { orderType: 'statusReport' },
          },
        ],
        docketNumber: mockDocketNumber,
      },
      docketEntryIdToEdit: propsBase.docketEntryIdToEdit,
      parentMessageId: mockParentMessageId,
    };

    await runAction(checkDocumentTypeAction, {
      modules: { presenter },
      props,
    });

    expect(pathDocumentTypeOrderStub).toHaveBeenCalledWith({
      path: `/case-detail/${mockDocketNumber}/edit-order/${mockDocketEntryId}/${mockParentMessageId}`,
    });
  });
});
