const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardF', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard F',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: 'You must select a category.',
        documentName: 'You must select a document.',
        documentType: 'You must select a document type.',
        ordinal: 'You must select an iteration.',
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Miscellaneous',
        documentName: 'Petition',
        documentType: '[First, Second, etc.] Amended [Document Name]',
        ordinal: 'First',
        scenario: 'Nonstandard F',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
