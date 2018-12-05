const assert = require('assert');
const { createDocumentMetadata } = require('./createDocumentMetadata');

describe('Create case', () => {
  let applicationContext;
  let documentMetaData = {
    userId: 'taxpayer',
    documentType: 'Petition',
  };

  beforeEach(() => {});

  it('Success', async () => {
    applicationContext = {
      persistence: {
        createDocumentMetadata: () =>
          Promise.resolve({
            documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          }),
      },
      environment: { stage: 'local' },
    };
    const document = await createDocumentMetadata({
      document: documentMetaData,
      applicationContext,
    });
    assert.equal(document.documentId, 'c54ba5a9-b37b-479d-9201-067ec6e335bb');
  });

  it('failure with null metadata', async () => {
    applicationContext = {
      persistence: {
        createDocumentMetadata: () => Promise.reject(new Error('problem')),
      },
      environment: { stage: 'local' },
    };
    try {
      await createDocumentMetadata({
        document: null,
        applicationContext,
      });
    } catch (error) {
      assert.equal(error.message, "Cannot read property 'userId' of null");
    }
  });
});
