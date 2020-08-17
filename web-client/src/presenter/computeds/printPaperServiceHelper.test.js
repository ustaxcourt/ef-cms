import { printPaperServiceHelper } from './printPaperServiceHelper';
import { runCompute } from 'cerebral/test';

describe('printPaperServiceHelper', () => {
  it('should set documentTitle to the documentType if set', () => {
    const { documentTitle } = runCompute(printPaperServiceHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
              documentType: 'Document',
            },
          ],
        },
        documentId: 'abc',
      },
    });
    expect(documentTitle).toEqual('Document');
  });

  it('should return an empty object if documentId is not set', () => {
    const result = runCompute(printPaperServiceHelper, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
              documentType: 'Document',
            },
          ],
        },
      },
    });
    expect(result).toEqual({});
  });
});
