const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardD', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard D',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: 'You must select a category.',
        date: 'You must provide a service date.',
        documentName: 'You must select a document.',
        documentType: 'You must select a document type.',
      });
    });

    it('should be valid when all fields are present', () => {
      const date = new Date().toISOString();
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        date,
        documentName: 'Petition',
        documentType: 'Certificate of Service [Document Name] [Date]',
        scenario: 'Nonstandard D',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
