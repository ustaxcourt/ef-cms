import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { ExternalDocumentNonStandardB } from './ExternalDocumentNonStandardB';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('ExternalDocumentNonStandardB', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const externalDocumentB = ExternalDocumentFactory({
        scenario: 'Nonstandard B',
      });

      expect(externalDocumentB.getFormattedValidationErrors()).toEqual({
        category:
          ExternalDocumentNonStandardB.VALIDATION_ERROR_MESSAGES.category,
        documentType:
          ExternalDocumentNonStandardB.VALIDATION_ERROR_MESSAGES
            .documentType[1],
        freeText:
          ExternalDocumentNonStandardB.VALIDATION_ERROR_MESSAGES.freeText[0]
            .message,
      });
    });

    it('should be valid when all fields are present', () => {
      const externalDocumentB = ExternalDocumentFactory({
        category: 'Application',
        documentTitle: 'Application to Take Deposition of [Name]',
        documentType: 'Application to Take Deposition',
        freeText: 'Petition',
        scenario: 'Nonstandard B',
      });

      expect(externalDocumentB.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const externalDocumentB = ExternalDocumentFactory({
        category: 'Application',
        documentTitle: getTextByCount(3001),
        documentType: 'Application to Take Deposition',
        freeText: 'Petition',
        scenario: 'Nonstandard B',
      });

      expect(externalDocumentB.getFormattedValidationErrors()).toEqual({
        documentTitle:
          ExternalDocumentNonStandardB.VALIDATION_ERROR_MESSAGES.documentTitle,
      });
    });
  });

  it('should not validate when freeText is over 1000 characters', () => {
    const externalDocumentB = ExternalDocumentFactory({
      category: 'Application',
      documentTitle: 'Application to Take Deposition of [Name]',
      documentType: 'Application to Take Deposition',
      freeText: getTextByCount(1001),
      scenario: 'Nonstandard B',
    });

    expect(externalDocumentB.getFormattedValidationErrors()).toEqual({
      freeText:
        ExternalDocumentNonStandardB.VALIDATION_ERROR_MESSAGES.freeText[1]
          .message,
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const externalDocumentB = ExternalDocumentFactory({
        category: 'Application',
        documentTitle: 'Application to Take Deposition of [Name]',
        documentType: 'Application to Take Deposition',
        freeText: 'Petition',
        scenario: 'Nonstandard B',
      });

      expect(externalDocumentB.getDocumentTitle()).toEqual(
        'Application to Take Deposition of Petition',
      );
    });
  });
});
