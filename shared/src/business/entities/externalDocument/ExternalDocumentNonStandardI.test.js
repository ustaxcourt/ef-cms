const {
  over1000Characters,
  over3000Characters,
} = require('../../test/createTestApplicationContext');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');
const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardI', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory({
        scenario: 'Nonstandard I',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: VALIDATION_ERROR_MESSAGES.category,
        documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
        freeText: VALIDATION_ERROR_MESSAGES.freeText[0].message,
        ordinalValue: VALIDATION_ERROR_MESSAGES.ordinalValue,
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: '[First, Second, etc.] Amendment to [anything]',
        documentType: 'Amendment [anything]',
        freeText: 'Test',
        ordinalValue: 'First',
        scenario: 'Nonstandard I',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when freeText is over 1000 characters', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: '[First, Second, etc.] Amendment to [anything]',
        documentType: 'Amendment [anything]',
        freeText: over1000Characters,
        ordinalValue: 'First',
        scenario: 'Nonstandard I',
      });

      expect(extDoc.getFormattedValidationErrors()).toEqual({
        freeText: VALIDATION_ERROR_MESSAGES.freeText[1].message,
      });
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: over3000Characters,
        documentType: 'Amendment [anything]',
        freeText: 'Test',
        ordinalValue: 'First',
        scenario: 'Nonstandard I',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        documentTitle: VALIDATION_ERROR_MESSAGES.documentTitle,
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: '[First, Second, etc.] Amendment to [anything]',
        documentType: 'Amendment [anything]',
        freeText: 'Test',
        ordinalValue: 'First',
        scenario: 'Nonstandard I',
      });
      expect(extDoc.getDocumentTitle()).toEqual('First Amendment to Test');
    });
  });
});
