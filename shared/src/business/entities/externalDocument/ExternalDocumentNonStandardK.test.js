const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');
const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardK', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard K',
      });

      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: VALIDATION_ERROR_MESSAGES.category,
        documentTitle: VALIDATION_ERROR_MESSAGES.documentTitle,
        documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
        freeText: VALIDATION_ERROR_MESSAGES.freeText,
        ordinalValue: VALIDATION_ERROR_MESSAGES.ordinalValue,
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supplement',
        documentTitle: '[First, Second, etc.] Supplement To [anything]',
        documentType: 'Supplement To [anything]',
        freeText: 'Test',
        ordinalValue: 'What Iteration Is this filing?',
        scenario: 'Nonstandard K',
      });

      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supplement',
        documentTitle: '[First, Second, etc.] Supplement To [anything]',
        documentType: 'Supplement To [anything]',
        freeText: 'Test',
        ordinalValue: 'First',
        scenario: 'Nonstandard K',
      });

      expect(extDoc.getDocumentTitle()).toEqual('First Supplement To Test');
    });
  });
});
