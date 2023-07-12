import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { ExternalDocumentNonStandardJ } from './ExternalDocumentNonStandardJ';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('ExternalDocumentNonStandardJ', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const exexternalDocumentJDoc = ExternalDocumentFactory({
        scenario: 'Nonstandard J',
      });

      expect(exexternalDocumentJDoc.getFormattedValidationErrors()).toEqual({
        category:
          ExternalDocumentNonStandardJ.VALIDATION_ERROR_MESSAGES.category,
        documentType:
          ExternalDocumentNonStandardJ.VALIDATION_ERROR_MESSAGES
            .documentType[1],
        freeText:
          ExternalDocumentNonStandardJ.VALIDATION_ERROR_MESSAGES.freeText[0]
            .message,
        freeText2:
          ExternalDocumentNonStandardJ.VALIDATION_ERROR_MESSAGES.freeText2[0]
            .message,
      });
    });

    it('should be valid when all fields are present', () => {
      const externalDocumentJ = ExternalDocumentFactory({
        category: 'Decision',
        documentTitle: 'Stipulated Decision Entered [judge] [anything]',
        documentType: 'Stipulated Decision',
        freeText: 'Test',
        freeText2: 'Test2',
        scenario: 'Nonstandard J',
      });

      expect(externalDocumentJ.getFormattedValidationErrors()).toEqual(null);
    });

    it('should not be valid when freeText or freeText2 is over 1000 characters', () => {
      const externalDocumentJ = ExternalDocumentFactory({
        category: 'Decision',
        documentTitle: 'Stipulated Decision Entered [judge] [anything]',
        documentType: 'Stipulated Decision',
        freeText: getTextByCount(1001),
        freeText2: getTextByCount(1001),
        scenario: 'Nonstandard J',
      });

      expect(externalDocumentJ.getFormattedValidationErrors()).toEqual({
        freeText:
          ExternalDocumentNonStandardJ.VALIDATION_ERROR_MESSAGES.freeText[1]
            .message,
        freeText2:
          ExternalDocumentNonStandardJ.VALIDATION_ERROR_MESSAGES.freeText2[1]
            .message,
      });
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const externalDocumentJ = ExternalDocumentFactory({
        category: 'Decision',
        documentTitle: getTextByCount(3001),
        documentType: 'Stipulated Decision',
        freeText: 'Test',
        freeText2: 'Test2',
        scenario: 'Nonstandard J',
      });

      expect(externalDocumentJ.getFormattedValidationErrors()).toEqual({
        documentTitle:
          ExternalDocumentNonStandardJ.VALIDATION_ERROR_MESSAGES.documentTitle,
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const externalDocumentJ = ExternalDocumentFactory({
        category: 'Decision',
        documentTitle: 'Stipulated Decision Entered [judge] [anything]',
        documentType: 'Stipulated Decision',
        freeText: 'Test',
        freeText2: 'Test2',
        scenario: 'Nonstandard J',
      });

      expect(externalDocumentJ.getDocumentTitle()).toEqual(
        'Stipulated Decision Entered Test Test2',
      );
    });
  });
});
