const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');
const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');
const { getTextByCount } = require('../../utilities/getTextByCount');

describe('ExternalDocumentNonStandardE', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory({
        scenario: 'Nonstandard E',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: VALIDATION_ERROR_MESSAGES.category,
        documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
        trialLocation: VALIDATION_ERROR_MESSAGES.trialLocation,
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Motion',
        documentTitle:
          'Motion to Change Place of Submission of Declaratory Judgment Case to [Place]',
        documentType:
          'Motion to Change Place of Submission of Declaratory Judgment Case',
        scenario: 'Nonstandard E',
        trialLocation: 'Little Rock, AR',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Motion',
        documentTitle: getTextByCount(3001),
        documentType:
          'Motion to Change Place of Submission of Declaratory Judgment Case',
        scenario: 'Nonstandard E',
        trialLocation: 'Little Rock, AR',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        documentTitle: VALIDATION_ERROR_MESSAGES.documentTitle,
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Motion',
        documentTitle:
          'Motion to Change Place of Submission of Declaratory Judgment Case to [Place]',
        documentType:
          'Motion to Change Place of Submission of Declaratory Judgment Case',
        scenario: 'Nonstandard E',
        trialLocation: 'Little Rock, AR',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Motion to Change Place of Submission of Declaratory Judgment Case to Little Rock, AR',
      );
    });
  });
});
