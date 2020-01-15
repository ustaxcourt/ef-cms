import { editDocketEntryHelper as editDocketEntryHelperComputed } from './editDocketEntryHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../src/withAppContext';

const editDocketEntryHelper = withAppContextDecorator(
  editDocketEntryHelperComputed,
);

describe('editDocketEntryHelper', () => {
  it('should return false for showPaperServiceWarning if the document is not a contact change document type', () => {
    const result = runCompute(editDocketEntryHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
              documentType: 'Generic Document',
            },
          ],
        },
        documentId: 'abc',
      },
    });
    expect(result.showPaperServiceWarning).toEqual(false);
  });

  it('should return false for showPaperServiceWarning if the document is a contact change document type but does not have incomplete qc work items', () => {
    const result = runCompute(editDocketEntryHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
              documentType: 'Notice of Change of Address',
              workItems: [{ isQC: true, isRead: true }],
            },
          ],
        },
        documentId: 'abc',
      },
    });
    expect(result.showPaperServiceWarning).toEqual(false);
  });

  it('should return false for showPaperServiceWarning if the document is a contact change document type and it does not have any work items', () => {
    const result = runCompute(editDocketEntryHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
              documentType: 'Notice of Change of Address',
            },
          ],
        },
        documentId: 'abc',
      },
    });
    expect(result.showPaperServiceWarning).toEqual(false);
  });

  it('should return true for showPaperServiceWarning if the document is a contact change document type and it has incomplete qc work items', () => {
    const result = runCompute(editDocketEntryHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
              documentType: 'Notice of Change of Address',
              workItems: [{ isQC: true, isRead: false }],
            },
          ],
        },
        documentId: 'abc',
      },
    });
    expect(result.showPaperServiceWarning).toEqual(true);
  });
});
