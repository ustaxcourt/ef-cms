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
    const errors = validateExternalDocumentInformationInteractor({
      applicationContext,
      documentMetadata: {},
    });

    expect(errors).toEqual({
      attachments: VALIDATION_ERROR_MESSAGES.attachments,
      certificateOfService: VALIDATION_ERROR_MESSAGES.certificateOfService,
      hasSupportingDocuments: VALIDATION_ERROR_MESSAGES.hasSupportingDocuments,
      partyPrimary: VALIDATION_ERROR_MESSAGES.partyPrimary,
      primaryDocumentFile: VALIDATION_ERROR_MESSAGES.primaryDocumentFile,
    });
  });

  it('returns no errors when all fields are defined', () => {
    const errors = validateExternalDocumentInformationInteractor({
      applicationContext,
      documentMetadata: {
        attachments: false,
        certificateOfService: false,
        hasSupportingDocuments: false,
        partyPrimary: true,
        primaryDocumentFile: { file: 'yes!' },
      },
    });

    expect(errors).toEqual(null);
  });
});
