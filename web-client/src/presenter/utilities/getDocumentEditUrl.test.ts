import { getDocumentEditUrl } from './getDocumentEditUrl';

describe('getDocumentEditUrl', () => {
  it('should return the edit link for an uploaded court issued document when the document type is Miscellaneous', () => {
    const mockCaseDetail = {
      docketNumber: '123-45',
    };
    const mockDocument = {
      docketEntryId: '83d2e520-d566-4324-abd9-15b8bec55123',
      documentType: 'Miscellaneous',
    };

    const result = getDocumentEditUrl({
      caseDetail: mockCaseDetail,
      document: mockDocument,
    });

    expect(result).toBe(
      `/case-detail/${mockCaseDetail.docketNumber}/edit-upload-court-issued/${mockDocument.docketEntryId}`,
    );
  });

  it('should return the edit link for an order when the document type is NOT Miscellaneous', () => {
    const mockCaseDetail = {
      docketNumber: '123-45',
    };
    const mockDocument = {
      docketEntryId: '83d2e520-d566-4324-abd9-15b8bec55123',
      documentType: 'Notice',
    };

    const result = getDocumentEditUrl({
      caseDetail: mockCaseDetail,
      document: mockDocument,
    });

    expect(result).toBe(
      `/case-detail/${mockCaseDetail.docketNumber}/edit-order/${mockDocument.docketEntryId}`,
    );
  });
});
