import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { formattedDocument as formattedDocumentComputed } from './formattedDocument';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedDocument', () => {
  const formattedDocument = withAppContextDecorator(
    formattedDocumentComputed,
    applicationContext,
  );

  it('should return the formatted document', () => {
    const result = runCompute(formattedDocument, {
      state: {
        caseDetail: {
          documents: [
            {
              createdAt: '2019-03-01T21:40:46.415Z',
              documentId: '123',
              documentTitle: 'Answer',
              documentType: 'Answer',
            },
          ],
        },
        documentId: '123',
      },
    });
    expect(result).toMatchObject({
      createdAtFormatted: '03/01/19',
      documentId: '123',
      documentTitle: 'Answer',
      documentType: 'Answer',
    });
  });

  it('should return the formatted correspondence document', () => {
    const result = runCompute(formattedDocument, {
      state: {
        caseDetail: {
          correspondence: [
            {
              createdAt: '2019-03-01T21:40:46.415Z',
              documentId: '123',
              documentTitle: 'Correspondence',
              documentType: 'Correspondence',
            },
          ],
        },
        documentId: '123',
      },
    });
    expect(result).toMatchObject({
      createdAtFormatted: '03/01/19',
      documentId: '123',
      documentTitle: 'Correspondence',
      documentType: 'Correspondence',
    });
  });

  it('should return undefined if the documentId is not present in the caseDetail documents', () => {
    const result = runCompute(formattedDocument, {
      state: {
        caseDetail: {
          documents: [
            {
              createdAt: '2019-03-01T21:40:46.415Z',
              documentId: '123',
              documentTitle: 'Answer',
              documentType: 'Answer',
            },
          ],
        },
        documentId: '234',
      },
    });
    expect(result).toEqual(undefined);
  });
});
