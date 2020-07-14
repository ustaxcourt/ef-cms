import { paperDocketEntryHelper } from './paperDocketEntryHelper';
import { runCompute } from 'cerebral/test';

describe('paperDocketEntryHelper', () => {
  it('should set showAddDocumentAlert to TRUE if documentId is NOT set and user is editing docket entry', () => {
    const result = runCompute(paperDocketEntryHelper, {
      state: {
        isEditingDocketEntry: true,
      },
    });

    expect(result.showAddDocumentAlert).toBeTruthy();
  });

  it('should set showAddDocumentAlert to FALSE if documentId is NOT set and user is NOT editing docket entry', () => {
    const result = runCompute(paperDocketEntryHelper, {
      state: {
        isEditingDocketEntry: false,
      },
    });

    expect(result.showAddDocumentAlert).toBeFalsy();
  });

  it('should set showAddDocumentAlert to FALSE if documentId is set in the state and user is editing docket entry', () => {
    const result = runCompute(paperDocketEntryHelper, {
      state: {
        documentId: 'document-id-123',
        isEditingDocketEntry: true,
      },
    });
    expect(result.showAddDocumentAlert).toBeFalsy();
  });
});
