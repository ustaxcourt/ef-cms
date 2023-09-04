import { ExternalDocumentInformationFactory } from './ExternalDocumentInformationFactory';
import { SupportingDocumentInformationFactory } from './SupportingDocumentInformationFactory';

describe('SupportingDocumentInformationFactory', () => {
  describe('constructor', () => {
    it('should set attachments to false when no value is provided', () => {
      const documentInstance = new SupportingDocumentInformationFactory(
        {
          certificateOfService: false,
          supportingDocument: 'Brief in Support',
          supportingDocumentFile: {},
        },
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES,
      );
      expect(documentInstance.attachments).toBe(false);
    });
  });

  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = new SupportingDocumentInformationFactory(
        {},
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES,
      );
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        certificateOfService:
          ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
            .certificateOfService,
        supportingDocument:
          ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
            .supportingDocument,
      });
    });

    it('should have an supportingDocumentFreeText error message if the supportingDocument is in supportingDocumentFreeTextCategories', () => {
      const extDoc = new SupportingDocumentInformationFactory(
        {
          attachments: true,
          certificateOfService: false,
          supportingDocument: 'Affidavit in Support',
          supportingDocumentFile: {},
        },
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES,
      );
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        supportingDocumentFreeText:
          ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
            .supportingDocumentFreeText,
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = new SupportingDocumentInformationFactory(
        {
          attachments: true,
          certificateOfService: false,
          supportingDocument: 'Brief in Support',
          supportingDocumentFile: {},
        },
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES,
      );
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    describe('Has Certificate of Service', () => {
      it('should require certificate of service date be entered', () => {
        const extDoc = new SupportingDocumentInformationFactory(
          {
            attachments: true,
            certificateOfService: true,
            supportingDocument: 'Brief in Support',
            supportingDocumentFile: {},
          },
          ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES,
        );
        expect(extDoc.getFormattedValidationErrors()).toEqual({
          certificateOfServiceDate:
            ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES
              .certificateOfServiceDate[1],
        });
      });
    });
  });
});
