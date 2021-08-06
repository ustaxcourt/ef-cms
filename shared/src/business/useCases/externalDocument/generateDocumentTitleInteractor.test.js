const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateDocumentTitleInteractor,
} = require('./generateDocumentTitleInteractor');

describe('generateDocumentTitleInteractor', () => {
  it('generates a document title from passed metadata', async () => {
    const title = await generateDocumentTitleInteractor(applicationContext, {
      documentMetadata: {
        documentTitle: 'abc',
        previousDocument: {
          documentTitle: 'TITLE',
        },
        scenario: 'nonstandard a',
      },
    });

    expect(title).toEqual('abc');
  });

  it('generate the full document title for the previousDocument when documentMetadata.previousDocument exists', async () => {
    const title = await generateDocumentTitleInteractor(applicationContext, {
      documentMetadata: {
        documentTitle: 'abc [pizza]',
        previousDocument: {
          addToCoversheet: true,
          additionalInfo: 'Cool',
          documentTitle: 'Title',
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
    await generateDocumentTitleInteractor(applicationContext, {
      documentMetadata: {
        documentTitle: 'abc [pizza]',
        scenario: 'nonstandard a',
      },
    });

    expect(
      applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo,
    ).not.toHaveBeenCalled();
  });
});
