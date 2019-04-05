const {
  ExternalDocumentFactory,
} = require('../../entities/externalDocument/ExternalDocumentFactory');
const {
  validateExternalDocument,
} = require('./validateExternalDocumentInteractor');

describe('validateExternalDocument', () => {
  it('returns the expected errors object on an empty message', () => {
    const errors = validateExternalDocument({
      applicationContext: {
        getEntityConstructors: () => ({
          ExternalDocumentFactory,
        }),
      },
      documentMetadata: {},
    });

    expect(errors).toEqual({
      category: 'You must select a category.',
      documentType: 'You must select a document type.',
    });
  });

  it('returns no errors when all fields are defined', () => {
    const errors = validateExternalDocument({
      applicationContext: {
        getEntityConstructors: () => ({
          ExternalDocumentFactory,
        }),
      },
      documentMetadata: {
        category: 'Application',
        documentType: 'Application for Waiver of Filing Fee',
        scenario: 'Standard',
      },
    });

    expect(errors).toEqual(null);
  });
});
