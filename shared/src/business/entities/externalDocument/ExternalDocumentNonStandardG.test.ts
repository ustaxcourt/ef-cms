const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');
const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');
const { getTextByCount } = require('../../utilities/getTextByCount');

describe('ExternalDocumentNonStandardG', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory({
        scenario: 'Nonstandard G',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: VALIDATION_ERROR_MESSAGES.category,
        documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
        ordinalValue: VALIDATION_ERROR_MESSAGES.ordinalValue,
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Answer',
        documentTitle: '[First, Second, etc.] Amendment to Answer',
        documentType: 'Amendment to Answer',
        ordinalValue: 'First',
        scenario: 'Nonstandard G',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Answer',
        documentTitle: getTextByCount(3001),
        documentType: 'Amendment to Answer',
        ordinalValue: 'First',
        scenario: 'Nonstandard G',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        documentTitle: VALIDATION_ERROR_MESSAGES.documentTitle,
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Answer',
        documentTitle: '[First, Second, etc.] Amendment to Answer',
        documentType: 'Amendment to Answer',
        ordinalValue: '1',
        scenario: 'Nonstandard G',
      });
      expect(extDoc.getDocumentTitle()).toEqual('First Amendment to Answer');
    });

    it('should generate title with an otherIteration defined when ordinalValue is "Other"', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Answer',
        documentTitle: '[First, Second, etc.] Amendment to Answer',
        documentType: 'Amendment to Answer',
        ordinalValue: 'Other',
        otherIteration: '50',
        scenario: 'Nonstandard G',
      });
      expect(extDoc.getDocumentTitle()).toEqual('Fiftieth Amendment to Answer');
    });
  });
});
