const { SupportingDocumentFactory } = require('./SupportingDocumentFactory');

describe('SupportingDocumentFactory', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = SupportingDocumentFactory.get({});
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        attachments: 'Enter selection for Attachments.',
        certificateOfService: 'Enter selection for Certificate of Service.',
        supportingDocument: 'Enter selection for Supporting Document.',
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = SupportingDocumentFactory.get({
        attachments: true,
        certificateOfService: false,
        supportingDocument: 'Brief in Support',
        supportingDocumentFile: {},
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    describe('Has Certificate of Service', () => {
      it('should require certificate of service date be entered', () => {
        const extDoc = SupportingDocumentFactory.get({
          attachments: true,
          certificateOfService: true,
          supportingDocument: 'Brief in Support',
          supportingDocumentFile: {},
        });
        expect(extDoc.getFormattedValidationErrors()).toEqual({
          certificateOfServiceDate: 'Enter a Certificate of Service Date.',
        });
      });
    });
  });
});
