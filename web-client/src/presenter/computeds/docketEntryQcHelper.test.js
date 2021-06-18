import { docketEntryQcHelper as docketEntryQcHelperComputed } from './docketEntryQcHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const docketEntryQcHelper = withAppContextDecorator(
  docketEntryQcHelperComputed,
);

describe('docketEntryQcHelper', () => {
  it('should return false for showPaperServiceWarning if the document is not a contact change document type', () => {
    const result = runCompute(docketEntryQcHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentType: 'Generic Document',
            },
          ],
        },
        docketEntryId: 'abc',
      },
    });
    expect(result.showPaperServiceWarning).toEqual(false);
  });

  it('should return false for showPaperServiceWarning if the document is a contact change document type but does not have incomplete qc work items', () => {
    const result = runCompute(docketEntryQcHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentType: 'Notice of Change of Address',
              workItem: { isRead: true },
            },
          ],
        },
        docketEntryId: 'abc',
      },
    });
    expect(result.showPaperServiceWarning).toEqual(false);
  });

  it('should return false for showPaperServiceWarning if the document is a contact change document type and it does not have any work items', () => {
    const result = runCompute(docketEntryQcHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentType: 'Notice of Change of Address',
            },
          ],
        },
        docketEntryId: 'abc',
      },
    });
    expect(result.showPaperServiceWarning).toEqual(false);
  });

  it('should return true for showPaperServiceWarning if the document is a contact change document type and it has incomplete qc work items', () => {
    const result = runCompute(docketEntryQcHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentType: 'Notice of Change of Address',
              workItem: { isRead: false },
            },
          ],
        },
        docketEntryId: 'abc',
      },
    });
    expect(result.showPaperServiceWarning).toEqual(true);
  });
});
