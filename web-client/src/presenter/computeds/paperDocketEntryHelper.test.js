import { paperDocketEntryHelper } from './paperDocketEntryHelper';
import { runCompute } from 'cerebral/test';

describe('paperDocketEntryHelper', () => {
  it('should set showAddDocumentWarning to TRUE if documentId is NOT set and user is editing docket entry', () => {
    const result = runCompute(paperDocketEntryHelper, {
      state: {
        caseDetail: {},
        isEditingDocketEntry: true,
      },
    });

    expect(result.showAddDocumentWarning).toBeTruthy();
  });

  it('should set showAddDocumentWarning to FALSE if documentId is NOT set and user is NOT editing docket entry', () => {
    const result = runCompute(paperDocketEntryHelper, {
      state: {
        caseDetail: {},
        isEditingDocketEntry: false,
      },
    });

    expect(result.showAddDocumentWarning).toBeFalsy();
  });

  it('should set showAddDocumentWarning to FALSE if documentId is set in the state and user is editing docket entry with a document attached', () => {
    const result = runCompute(paperDocketEntryHelper, {
      state: {
        caseDetail: {
          documents: [{ documentId: 'document-id-123', isFileAttached: true }],
        },
        documentId: 'document-id-123',
        isEditingDocketEntry: true,
      },
    });

    expect(result.showAddDocumentWarning).toBeFalsy();
  });

  it('should set showAddDocumentWarning to TRUE if documentId is set in the state and user is editing docket entry with NO document attached', () => {
    const result = runCompute(paperDocketEntryHelper, {
      state: {
        caseDetail: {
          documents: [{ documentId: 'document-id-123', isFileAttached: false }],
        },
        documentId: 'document-id-123',
        isEditingDocketEntry: true,
      },
    });

    expect(result.showAddDocumentWarning).toBeTruthy();
  });
});
