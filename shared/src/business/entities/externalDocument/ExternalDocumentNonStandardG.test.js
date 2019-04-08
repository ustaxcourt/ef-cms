const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardG', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard G',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: 'You must select a category.',
        documentType: 'You must select a document type.',
        ordinalValue: 'You must select an iteration.',
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Answer',
        documentType: '[First, Second, etc.] Amendment to Answer',
        ordinalValue: 'First',
        scenario: 'Nonstandard G',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
