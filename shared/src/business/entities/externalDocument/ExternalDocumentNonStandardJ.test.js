const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');
const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardJ', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard J',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: VALIDATION_ERROR_MESSAGES.category,
        documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
        freeText: VALIDATION_ERROR_MESSAGES.freeText,
        freeText2: VALIDATION_ERROR_MESSAGES.freeText2,
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Decision',
        documentTitle: 'Stipulated Decision Entered [judge] [anything]',
        documentType: 'Stipulated Decision',
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
        documentType: 'Stipulated Decision',
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
