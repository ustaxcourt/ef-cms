import { paperDocketEntryHelper } from './paperDocketEntryHelper';
import { runCompute } from 'cerebral/test';

describe('paperDocketEntryHelper', () => {
  it('should set showAddDocumentWarning to TRUE if documentId is NOT set, documentUploadMode is not preview, and user is editing docket entry', () => {
    const result = runCompute(paperDocketEntryHelper, {
      state: {
        caseDetail: {},
        currentViewMetadata: {
          documentUploadMode: 'scan',
        },
        isEditingDocketEntry: true,
      },
    });

    expect(result.showAddDocumentWarning).toBeTruthy();
  });

  it('should set showAddDocumentWarning to FALSE if documentId is NOT set, documentUploadMode is not preview, and user is NOT editing docket entry', () => {
    const result = runCompute(paperDocketEntryHelper, {
      state: {
        caseDetail: {},
        currentViewMetadata: {
          documentUploadMode: 'scan',
        },
        isEditingDocketEntry: false,
      },
    });

    expect(result.showAddDocumentWarning).toBeFalsy();
  });

  it('should set showAddDocumentWarning to FALSE if documentId is set in the state, documentUploadMode is preview, and user is editing docket entry with a document attached', () => {
    const result = runCompute(paperDocketEntryHelper, {
      state: {
        caseDetail: {
          documents: [{ documentId: 'document-id-123', isFileAttached: true }],
        },
        currentViewMetadata: {
          documentUploadMode: 'preview',
        },
        documentId: 'document-id-123',
        isEditingDocketEntry: true,
      },
    });

    expect(result.showAddDocumentWarning).toBeFalsy();
  });

  it('should set showAddDocumentWarning to TRUE if documentId is set in the state, documentUploadMode is not preview, and user is editing docket entry with NO document attached', () => {
    const result = runCompute(paperDocketEntryHelper, {
      state: {
        caseDetail: {
          documents: [{ documentId: 'document-id-123', isFileAttached: false }],
        },
        currentViewMetadata: {
          documentUploadMode: 'scan',
        },
        documentId: 'document-id-123',
        isEditingDocketEntry: true,
      },
    });

    expect(result.showAddDocumentWarning).toBeTruthy();
  });
});
