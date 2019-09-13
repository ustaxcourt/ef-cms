const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardG', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard G',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: 'Select a Category.',
        documentType: 'Select a document type',
        ordinalValue: 'Select an iteration.',
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Answer',
        documentTitle: '[First, Second, etc.] Amendment to Answer',
        documentType: 'Amendment to Answer',
        ordinalValue: 'First',
        scenario: 'Nonstandard G',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Answer',
        documentTitle: '[First, Second, etc.] Amendment to Answer',
        documentType: 'Amendment to Answer',
        ordinalValue: 'First',
        scenario: 'Nonstandard G',
      });
      expect(extDoc.getDocumentTitle()).toEqual('First Amendment to Answer');
    });
  });
});
