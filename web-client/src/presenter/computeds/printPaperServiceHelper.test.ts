import { printPaperServiceHelper } from './printPaperServiceHelper';
import { runCompute } from 'cerebral/test';

describe('printPaperServiceHelper', () => {
  it('should set documentTitle to the documentTitle if set', () => {
    const { documentTitle } = runCompute(printPaperServiceHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentTitle: 'Document',
              documentType: 'Document [Anything]',
            },
          ],
        },
        docketEntryId: 'abc',
      },
    });
    expect(documentTitle).toEqual('Document');
  });

  it('should return an empty object if docketEntryId is not set', () => {
    const result = runCompute(printPaperServiceHelper, {
      state: {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: 'abc',
              documentType: 'Document',
            },
          ],
        },
      },
    });
    expect(result).toEqual({});
  });
});
