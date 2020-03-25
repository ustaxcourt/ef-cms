const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generateDocumentTitleInteractor,
} = require('./generateDocumentTitleInteractor');

describe('generateDocumentTitleInteractor', () => {
  it('generates a document title from passed metadata', async () => {
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
