const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardJ', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard J',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: 'Select a Category.',
        documentType: 'Select a Document Type.',
        freeText: 'Provide an answer.',
        freeText2: 'Provide an answer.',
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Decision',
        documentTitle: 'Stipulated Decision Entered [judge] [anything]',
        documentType: 'Stipulated Decision Entered',
        freeText: 'Test',
        freeText2: 'Test2',
        scenario: 'Nonstandard J',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Decision',
        documentTitle: 'Stipulated Decision Entered [judge] [anything]',
        documentType: 'Stipulated Decision Entered',
        freeText: 'Test',
        freeText2: 'Test2',
        scenario: 'Nonstandard J',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Stipulated Decision Entered Test Test2',
      );
    });
  });
});
