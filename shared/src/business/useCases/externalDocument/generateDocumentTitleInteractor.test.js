const {
  ExternalDocumentFactory,
} = require('../../entities/externalDocument/ExternalDocumentFactory');
const { generateDocumentTitle } = require('./generateDocumentTitleInteractor');

describe('generateDocumentTitle', () => {
  let applicationContext;

  it('generates a document title from passed metadata', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getEntityConstructors: () => ({
        ExternalDocumentFactory,
      }),
    };
    const title = await generateDocumentTitle({
      applicationContext,
      documentMetadata: {
        documentTitle: 'abc',
        previousDocument: 'abc 1',
        scenario: 'nonstandard a',
      },
    });
    expect(title).toEqual('abc');
  });
});
