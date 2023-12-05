import { SupportingDocumentInformationFactory } from './SupportingDocumentInformationFactory';

describe('SupportingDocumentInformationFactory', () => {
  describe('constructor', () => {
    it('should set attachments to false when no value is provided', () => {
      const documentInstance = new SupportingDocumentInformationFactory({
        certificateOfService: false,
        supportingDocument: 'Brief in Support',
        supportingDocumentFile: {},
      });

      expect(documentInstance.attachments).toBe(false);
    });
  });

  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = new SupportingDocumentInformationFactory({});

      expect(extDoc.getFormattedValidationErrors()).toEqual({
        certificateOfService:
          'Indicate whether you are including a Certificate of Service',
        supportingDocument: 'Select a document type',
      });
    });

    it('should have an supportingDocumentFreeText error message if the supportingDocument is in supportingDocumentFreeTextCategories', () => {
      const extDoc = new SupportingDocumentInformationFactory({
        attachments: true,
        certificateOfService: false,
        supportingDocument: 'Affidavit in Support',
        supportingDocumentFile: {},
      });

      expect(extDoc.getFormattedValidationErrors()).toEqual({
        supportingDocumentFreeText: 'Enter name',
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = new SupportingDocumentInformationFactory({
        attachments: true,
        certificateOfService: false,
        supportingDocument: 'Brief in Support',
        supportingDocumentFile: {},
      });

      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    describe('Has Certificate of Service', () => {
      it('should require certificate of service date be entered', () => {
        const extDoc = new SupportingDocumentInformationFactory({
          attachments: true,
          certificateOfService: true,
          supportingDocument: 'Brief in Support',
          supportingDocumentFile: {},
        });

        expect(extDoc.getFormattedValidationErrors()).toEqual({
          certificateOfServiceDate: 'Enter date of service',
        });
      });
    });
  });
});
