import { applicationContext } from '../../test/createTestApplicationContext';
import { generateExternalDocumentTitle } from './generateExternalDocumentTitle';

describe('generateExternalDocumentTitle', () => {
  it('generates a document title from passed metadata', async () => {
    const title = await generateExternalDocumentTitle(applicationContext, {
      documentMetadata: {
        category: 'Motion',
        documentTitle: 'abc',
        documentType: 'Motion for Leave to File',
        previousDocument: {
          documentTitle: 'TITLE',
          documentType: 'Motion for Leave to File',
        },
        scenario: 'nonstandard a',
      },
    });

    expect(title).toEqual('abc');
  });

  it('generates a document title if previous document is undefined', async () => {
    const title = await generateExternalDocumentTitle(applicationContext, {
      documentMetadata: {
        category: 'Motion',
        documentTitle: 'abc',
        documentType: 'Motion for Leave to File',
        previousDocument: {
          documentType: 'Motion for Leave to File',
        },
        scenario: 'nonstandard a',
      },
    });

    expect(title).toEqual('abc');
  });

  it('generate the full document title for the previousDocument when documentMetadata.previousDocument exists', async () => {
    const title = await generateExternalDocumentTitle(applicationContext, {
      documentMetadata: {
        category: 'Motion',
        documentTitle: 'abc [Document Name]',
        documentType: 'Motion for Leave to File',
        previousDocument: {
          addToCoversheet: true,
          additionalInfo: 'Cool',
          documentTitle: 'Title',
          documentType: 'Motion for Leave to File',
        },
        scenario: 'nonstandard a',
      },
    });

    expect(
      applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo,
    ).toHaveBeenCalled();
    expect(title).toBe('abc Title Cool');
  });

  it('should NOT generate a document title for the previousDocument when one does not exist on the document', async () => {
    await generateExternalDocumentTitle(applicationContext, {
      documentMetadata: {
        documentTitle: 'abc [pizza]',
        scenario: 'nonstandard a',
      },
    });

    expect(
      applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo,
    ).not.toHaveBeenCalled();
  });

  it('should not overwrite the origrinal metadata previousDocument title passed as an argument', async () => {
    const metadata = {
      documentMetadata: {
        category: 'Motion',
        documentTitle: 'abc [Document Name]',
        documentType: 'Motion for Leave to File',
        previousDocument: {
          addToCoversheet: true,
          additionalInfo: 'Cool',
          documentTitle: 'Title',
          documentType: 'Motion for Leave to File',
        },
        scenario: 'nonstandard a',
      },
    };

    const title = await generateExternalDocumentTitle(
      applicationContext,
      metadata,
    );

    expect(
      applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo,
    ).toHaveBeenCalled();
    expect(title).toBe('abc Title Cool');
    expect(metadata.documentMetadata.previousDocument.documentTitle).toBe(
      'Title',
    );
  });
});
