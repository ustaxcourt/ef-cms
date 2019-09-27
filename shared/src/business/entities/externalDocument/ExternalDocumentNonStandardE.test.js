const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');

describe('ExternalDocumentNonStandardE', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard E',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: VALIDATION_ERROR_MESSAGES.category,
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
        trialLocation: VALIDATION_ERROR_MESSAGES.trialLocation,
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory.get({
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
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = ExternalDocumentFactory.get({
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
