const {
  ExternalDocumentFactory,
} = require('../../entities/externalDocument/ExternalDocumentFactory');
const {
  generateDocumentTitleInteractor,
} = require('./generateDocumentTitleInteractor');

describe('generateDocumentTitleInteractor', () => {
  let applicationContext;

  it('generates a document title from passed metadata', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getEntityConstructors: () => ({
        ExternalDocumentFactory,
      }),
    };
    const title = await generateDocumentTitleInteractor({
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
