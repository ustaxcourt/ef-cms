const {
  SecondarySupportingDocumentFactory,
} = require('./SecondarySupportingDocumentFactory');

describe('SecondarySupportingDocumentFactory', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = SecondarySupportingDocumentFactory.get({});
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        attachments: 'Enter selection for Attachments.',
        certificateOfService: 'Enter selection for Certificate of Service.',
        secondarySupportingDocument:
          'Enter selection for Secondary Supporting Document.',
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = SecondarySupportingDocumentFactory.get({
        attachments: true,
        certificateOfService: false,
        secondarySupportingDocument: 'Brief in Support',
        secondarySupportingDocumentFile: {},
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    describe('Has Certificate of Service', () => {
      it('should require certificate of service date be entered', () => {
        const extDoc = SecondarySupportingDocumentFactory.get({
          attachments: true,
          certificateOfService: true,
          secondarySupportingDocument: 'Brief in Support',
          secondarySupportingDocumentFile: {},
        });
        expect(extDoc.getFormattedValidationErrors()).toEqual({
          certificateOfServiceDate: 'Enter a Certificate of Service Date.',
        });
      });
    });
  });
});
