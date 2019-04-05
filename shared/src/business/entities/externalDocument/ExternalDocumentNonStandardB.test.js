const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardB', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard B',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: 'You must select a category.',
        documentName: 'You must provide a document name.',
        documentType: 'You must select a document type.',
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Application',
        documentName: 'Petition',
        documentType: 'Application to Take Deposition of [Name]',
        scenario: 'Nonstandard B',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
