import { runCompute } from 'cerebral/test';

import { extractedDocument } from '../presenter/computeds/extractDocument';

describe('extractedDocument', () => {
  it('should return an empty object if no document was found', async () => {
    const result = await runCompute(extractedDocument, {
      state: {
        caseDetail: {
          documents: [],
        },
        documentId: 'abc',
      },
    });
    expect(result).toMatchObject({});
  });

  it('should return an empty object if no document was found', async () => {
    const result = await runCompute(extractedDocument, {
      state: {
        caseDetail: {
        },
        documentId: 'abc',
      },
    });
    expect(result).toMatchObject({});
  });

  it('should not fail when workItems is undefined', async () => {
    const result = await runCompute(extractedDocument, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
            }
          ]
        },
        documentId: 'abc',
      },
    });
    expect(result).toMatchObject({});
  });
});
