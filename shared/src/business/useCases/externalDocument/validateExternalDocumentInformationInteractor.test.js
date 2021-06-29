const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  validateExternalDocumentInformationInteractor,
} = require('./validateExternalDocumentInformationInteractor');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('../../entities/externalDocument/ExternalDocumentInformationFactory');

describe('validateExternalDocumentInformationInteractor', () => {
  it('returns the expected errors object on an empty message', () => {
    const errors = validateExternalDocumentInformationInteractor(
      applicationContext,
      {
        documentMetadata: { filers: [] },
      },
    );

    expect(errors).toEqual({
      certificateOfService: VALIDATION_ERROR_MESSAGES.certificateOfService,
      filers: VALIDATION_ERROR_MESSAGES.filers,
      hasSupportingDocuments: VALIDATION_ERROR_MESSAGES.hasSupportingDocuments,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
    });
  });

  it('returns no errors when all fields are defined', () => {
    const errors = validateExternalDocumentInformationInteractor(
      applicationContext,
      {
        documentMetadata: {
          attachments: false,
          certificateOfService: false,
          filers: ['759c5880-0c81-4a50-a38b-662da37e2954'],
          hasSupportingDocuments: false,
          primaryDocumentFile: { file: 'yes!' },
        },
      },
    );

    expect(errors).toEqual(null);
  });
});
