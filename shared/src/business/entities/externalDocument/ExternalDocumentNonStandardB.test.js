const {
  over1000Characters,
  over3000Characters,
} = require('../../test/createTestApplicationContext');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');
const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardB', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory({
        scenario: 'Nonstandard B',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: VALIDATION_ERROR_MESSAGES.category,
        documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
        freeText: VALIDATION_ERROR_MESSAGES.freeText[0].message,
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Application',
        documentTitle: 'Application to Take Deposition of [Name]',
        documentType: 'Application to Take Deposition',
        freeText: 'Petition',
        scenario: 'Nonstandard B',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Application',
        documentTitle: over3000Characters,
        documentType: 'Application to Take Deposition',
        freeText: 'Petition',
        scenario: 'Nonstandard B',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        documentTitle: VALIDATION_ERROR_MESSAGES.documentTitle,
      });
    });
  });

  it('should not validate when freeText is over 1000 characters', () => {
    const extDoc = ExternalDocumentFactory({
      category: 'Application',
      documentTitle: 'Application to Take Deposition of [Name]',
      documentType: 'Application to Take Deposition',
      freeText: over1000Characters,
      scenario: 'Nonstandard B',
    });
    expect(extDoc.getFormattedValidationErrors()).toEqual({
      freeText: VALIDATION_ERROR_MESSAGES.freeText[1].message,
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = ExternalDocumentFactory({
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
