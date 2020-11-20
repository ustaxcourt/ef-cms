const {
  SupportingDocumentInformationFactory,
} = require('./SupportingDocumentInformationFactory');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');

describe('SupportingDocumentInformationFactory', () => {
  describe('constructor', () => {
    it('should set attachments to false when no value is provided', () => {
      const documentInstance = SupportingDocumentInformationFactory.get({
        certificateOfService: false,
        supportingDocument: 'Brief in Support',
        supportingDocumentFile: {},
      });
      expect(documentInstance.attachments).toBe(false);
    });
  });

  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = SupportingDocumentInformationFactory.get(
        {},
        VALIDATION_ERROR_MESSAGES,
      );
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        certificateOfService: VALIDATION_ERROR_MESSAGES.certificateOfService,
        supportingDocument: VALIDATION_ERROR_MESSAGES.supportingDocument,
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = SupportingDocumentInformationFactory.get(
        {
          attachments: true,
          certificateOfService: false,
          supportingDocument: 'Brief in Support',
          supportingDocumentFile: {},
        },
        VALIDATION_ERROR_MESSAGES,
      );
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    describe('Has Certificate of Service', () => {
      it('should require certificate of service date be entered', () => {
        const extDoc = SupportingDocumentInformationFactory.get(
          {
            attachments: true,
            certificateOfService: true,
            supportingDocument: 'Brief in Support',
            supportingDocumentFile: {},
          },
          VALIDATION_ERROR_MESSAGES,
        );
        expect(extDoc.getFormattedValidationErrors()).toEqual({
          certificateOfServiceDate:
            VALIDATION_ERROR_MESSAGES.certificateOfServiceDate[1],
        });
      });
    });
  });
});
