import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { prepareUploadExternalDocumentsAction } from './prepareUploadExternalDocumentsAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('prepareUploadExternalDocumentsAction', () => {
  const mockFile = {
    name: 'petition',
    size: 100,
  };

  const mockDocumentMetadata = {
    consolidatedCasesToFileAcross: [],
    docketNumber: '101-18',
    fileAcrossConsolidatedGroup: true,
    filers: {},
    isFileAttached: true,
    primaryDocumentFile: {
      name: 'petition',
      size: 100,
    },
    privatePractitioners: null,
  };

  const mockSupportingDocument = {
    supportingDocumentFile: mockFile,
  };

  it('should return an object with a primary file and default document metadata', async () => {
    const results = await runAction(prepareUploadExternalDocumentsAction, {
      state: {
        caseDetail: MOCK_CASE,
        form: {
          fileAcrossConsolidatedGroup: true,
          filers: {},
          primaryDocumentFile: mockFile,
        },
      },
    });

    expect(results.output.files).toMatchObject({
      primary: mockFile,
    });
    expect(results.output.documentMetadata).toEqual(mockDocumentMetadata);
  });

  it('should return an object with a secondary file and mark secondaryDocument as attached', async () => {
    const results = await runAction(prepareUploadExternalDocumentsAction, {
      state: {
        caseDetail: MOCK_CASE,
        form: {
          filers: {},
          primaryDocumentFile: mockFile,
          secondaryDocument: { isFileAttached: false },
          secondaryDocumentFile: mockFile,
        },
      },
    });

    expect(results.output.files).toMatchObject({
      primary: mockFile,
      secondary: mockFile,
    });
    expect(
      results.output.documentMetadata.secondaryDocument.isFileAttached,
    ).toEqual(true);
  });

  it('should return supporting primary documents and set isFileAttached to true for each attached primary supporting document', async () => {
    const results = await runAction(prepareUploadExternalDocumentsAction, {
      state: {
        caseDetail: MOCK_CASE,
        form: {
          filers: {},
          hasSupportingDocuments: true,
          primaryDocumentFile: mockFile,
          supportingDocuments: [mockSupportingDocument, mockSupportingDocument],
        },
      },
    });
    expect(results.output.files).toMatchObject({
      primary: mockFile,
      primarySupporting0: mockFile,
      primarySupporting1: mockFile,
    });
    expect(results.output.documentMetadata).toMatchObject({
      supportingDocuments: [
        { isFileAttached: true, supportingDocumentFile: mockFile },
        { isFileAttached: true, supportingDocumentFile: mockFile },
      ],
    });
  });

  it('should return supporting secondary documents and set isFileAttached to true for each attached secondary supporting document', async () => {
    const results = await runAction(prepareUploadExternalDocumentsAction, {
      state: {
        caseDetail: MOCK_CASE,
        form: {
          filers: {},
          hasSecondarySupportingDocuments: true,
          primaryDocumentFile: mockFile,
          secondarySupportingDocuments: [
            mockSupportingDocument,
            mockSupportingDocument,
          ],
        },
      },
    });
    expect(results.output.files).toMatchObject({
      primary: mockFile,
      secondarySupporting0: mockFile,
      secondarySupporting1: mockFile,
    });
    expect(results.output.documentMetadata).toMatchObject({
      secondarySupportingDocuments: [
        { isFileAttached: true, supportingDocumentFile: mockFile },
        { isFileAttached: true, supportingDocumentFile: mockFile },
      ],
    });
  });
});
