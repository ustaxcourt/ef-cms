const {
  ExternalDocumentFactory,
} = require('../../entities/externalDocument/ExternalDocumentFactory');
const { generateDocumentTitle } = require('./generateDocumentTitleInteractor');

describe('generateDocumentTitle', () => {
  let applicationContext;

  it('throws an error when an unauthorized user tries to access the use case', async () => {
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
