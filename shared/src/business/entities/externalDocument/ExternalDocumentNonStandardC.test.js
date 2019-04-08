const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardC', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard C',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: 'You must select a category.',
        documentType: 'You must select a document type.',
        freeText: 'You must provide a value.',
        previousDocument: 'You must select a document.',
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentType: 'Affidavit Of [Name] in Support Of [Document Name]',
        freeText: 'Lori Loughlin',
        previousDocument: 'Petition',
        scenario: 'Nonstandard C',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
