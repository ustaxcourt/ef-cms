import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { ExternalDocumentNonStandardE } from './ExternalDocumentNonStandardE';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('ExternalDocumentNonStandardE', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const externalDocumentD = ExternalDocumentFactory({
        scenario: 'Nonstandard E',
      });

      expect(externalDocumentD.getFormattedValidationErrors()).toEqual({
        category:
          ExternalDocumentNonStandardE.VALIDATION_ERROR_MESSAGES.category,
        documentType:
          ExternalDocumentNonStandardE.VALIDATION_ERROR_MESSAGES
            .documentType[1],
        trialLocation:
          ExternalDocumentNonStandardE.VALIDATION_ERROR_MESSAGES.trialLocation,
      });
    });

    it('should be valid when all fields are present', () => {
      const externalDocumentD = ExternalDocumentFactory({
        category: 'Motion',
        documentTitle:
          'Motion to Change Place of Submission of Declaratory Judgment Case to [Place]',
        documentType:
          'Motion to Change Place of Submission of Declaratory Judgment Case',
        scenario: 'Nonstandard E',
        trialLocation: 'Little Rock, AR',
      });

      expect(externalDocumentD.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const externalDocumentD = ExternalDocumentFactory({
        category: 'Motion',
        documentTitle: getTextByCount(3001),
        documentType:
          'Motion to Change Place of Submission of Declaratory Judgment Case',
        scenario: 'Nonstandard E',
        trialLocation: 'Little Rock, AR',
      });

      expect(externalDocumentD.getFormattedValidationErrors()).toEqual({
        documentTitle:
          ExternalDocumentNonStandardE.VALIDATION_ERROR_MESSAGES.documentTitle,
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const externalDocumentD = ExternalDocumentFactory({
        category: 'Motion',
        documentTitle:
          'Motion to Change Place of Submission of Declaratory Judgment Case to [Place]',
        documentType:
          'Motion to Change Place of Submission of Declaratory Judgment Case',
        scenario: 'Nonstandard E',
        trialLocation: 'Little Rock, AR',
      });

      expect(externalDocumentD.getDocumentTitle()).toEqual(
        'Motion to Change Place of Submission of Declaratory Judgment Case to Little Rock, AR',
      );
    });
  });
});
