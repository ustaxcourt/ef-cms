const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardB', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard B',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: 'Select a Category.',
        documentType: 'Select a document type',
        freeText: 'Provide an answer',
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Application',
        documentTitle: 'Application to Take Deposition of [Name]',
        documentType: 'Application to Take Deposition',
        freeText: 'Petition',
        scenario: 'Nonstandard B',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Application',
        documentTitle: 'Application to Take Deposition of [Name]',
        documentType: 'Application to Take Deposition',
        freeText: 'Petition',
        scenario: 'Nonstandard B',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Application to Take Deposition of Petition',
      );
    });
  });
});
