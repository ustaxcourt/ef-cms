import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('ExternalDocumentNonStandardE', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const externalDocumentD = ExternalDocumentFactory({
        scenario: 'Nonstandard E',
      });
      const customMessages = extractCustomMessages(
        externalDocumentD.getValidationRules(),
      );
      expect(externalDocumentD.getFormattedValidationErrors()).toEqual({
        category: customMessages.category[0],
        documentType: customMessages.documentType[0],
        trialLocation: customMessages.trialLocation[0],
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
      const customMessages = extractCustomMessages(
        externalDocumentD.getValidationRules(),
      );
      expect(externalDocumentD.getFormattedValidationErrors()).toEqual({
        documentTitle: customMessages.documentTitle[0],
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
