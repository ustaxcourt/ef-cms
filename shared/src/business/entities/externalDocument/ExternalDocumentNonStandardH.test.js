const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardH', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard H',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: 'You must select a category.',
        documentType: 'You must select a document type.',
        secondaryCategory: 'You must select a category.',
        secondaryDocumentType: 'You must select a document type.',
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Motion',
        documentType: 'Motion for Leave to File [Document Name]',
        scenario: 'Nonstandard H',
        secondaryCategory: 'Application',
        secondaryDocumentType: 'Application for Waiver of Filing Fee',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
