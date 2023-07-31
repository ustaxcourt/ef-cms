import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { formattedDocument as formattedDocumentComputed } from './formattedDocument';
import { runCompute } from '@web-client/presenter/test.cerebral';
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
          correspondence: [],
          docketEntries: [
            {
              createdAt: '2019-03-01T21:40:46.415Z',
              docketEntryId: '123',
              documentTitle: 'Answer',
              documentType: 'Answer',
            },
          ],
        },
        docketEntryId: '123',
      },
    });
    expect(result).toMatchObject({
      createdAtFormatted: '03/01/19',
      docketEntryId: '123',
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
              correspondenceId: '123',
              createdAt: '2019-03-01T21:40:46.415Z',
              documentTitle: 'Correspondence',
              documentType: 'Correspondence',
            },
          ],
          docketEntries: [],
        },
        docketEntryId: '123',
      },
    });
    expect(result).toMatchObject({
      correspondenceId: '123',
      createdAtFormatted: '03/01/19',
      documentTitle: 'Correspondence',
      documentType: 'Correspondence',
    });
  });

  it('should return undefined if the docketEntryId is not present in the caseDetail docketEntries', () => {
    const result = runCompute(formattedDocument, {
      state: {
        caseDetail: {
          correspondence: [],
          docketEntries: [
            {
              createdAt: '2019-03-01T21:40:46.415Z',
              docketEntryId: '123',
              documentTitle: 'Answer',
              documentType: 'Answer',
            },
          ],
        },
        docketEntryId: '234',
      },
    });
    expect(result).toEqual(undefined);
  });
});
