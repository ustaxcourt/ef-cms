const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardA', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard A',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: 'You must select a category.',
        documentType: 'You must select a document type.',
        previousDocument: 'You must select a document.',
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentType: 'Brief in Support of [Document Name]',
        previousDocument: 'Petition',
        scenario: 'Nonstandard A',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
