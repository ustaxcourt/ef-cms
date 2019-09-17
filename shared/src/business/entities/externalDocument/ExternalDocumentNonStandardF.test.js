const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardF', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard F',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: 'Select a Category.',
        documentType: 'Select a document type',
        ordinalValue: 'Select an iteration',
        previousDocument: 'Select a document',
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Miscellaneous',
        documentTitle: '[First, Second, etc.] Amended [Document Name]',
        documentType: 'Amended',
        ordinalValue: 'First',
        previousDocument: 'Petition',
        scenario: 'Nonstandard F',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Miscellaneous',
        documentTitle: '[First, Second, etc.] Amended [Document Name]',
        documentType: 'Amended',
        ordinalValue: 'First',
        previousDocument: 'Petition',
        scenario: 'Nonstandard F',
      });
      expect(extDoc.getDocumentTitle()).toEqual('First Amended Petition');
    });
  });
});
