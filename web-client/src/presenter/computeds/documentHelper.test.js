import { runCompute } from 'cerebral/test';

import { documentHelper } from './documentHelper';

describe('documentHelper', () => {
  it('should return an empty object if no document was found', async () => {
    const result = await runCompute(documentHelper, {
      state: {
        caseDetail: {
          documents: [],
        },
        documentId: 'abc',
      },
    })({
      docketNumber: 'abc',
      documentId: '123',
    });
    expect(result).toEqual('/case-detail/abc/documents/123');
  });
});
