import { runCompute } from 'cerebral/test';

import { extractedDocument as extractedDocumentComputed } from './extractDocument';
import { withAppContextDecorator } from '../../../src/withAppContext';

const extractedDocument = withAppContextDecorator(extractedDocumentComputed);

describe('extractedDocument', () => {
  it('should return an empty object if no document was found', () => {
    const result = runCompute(extractedDocument, {
      state: {
        caseDetail: {
          documents: [],
        },
        documentId: 'abc',
      },
    });
    expect(result).toMatchObject({});
  });

  it('should return an empty object if no document was found', () => {
    const result = runCompute(extractedDocument, {
      state: {
        caseDetail: {},
        documentId: 'abc',
      },
    });
    expect(result).toMatchObject({});
  });

  it('should not fail when workItems is undefined', () => {
    const result = runCompute(extractedDocument, {
      state: {
        caseDetail: {
          documents: [
            {
              documentId: 'abc',
            },
          ],
        },
        documentId: 'abc',
      },
    });
    expect(result).toMatchObject({});
  });
});
