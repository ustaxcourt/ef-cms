const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  validateExternalDocumentInteractor,
} = require('./validateExternalDocumentInteractor');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('../../entities/externalDocument/ExternalDocumentInformationFactory');

describe('validateExternalDocumentInteractor', () => {
  it('returns the expected errors object on an empty message', () => {
    const errors = validateExternalDocumentInteractor(applicationContext, {
      documentMetadata: {},
    });

    expect(errors).toEqual({
      category: VALIDATION_ERROR_MESSAGES.category,
      documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
    });
  });

  it('returns no errors when all fields are defined', () => {
    const errors = validateExternalDocumentInteractor(applicationContext, {
      documentMetadata: {
        category: 'Application',
        documentType: 'Application for Waiver of Filing Fee',
        scenario: 'Standard',
      },
    });

    expect(errors).toEqual(null);
  });
});
