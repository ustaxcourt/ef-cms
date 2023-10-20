import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('ExternalDocumentNonStandardJ', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const exexternalDocumentJDoc = ExternalDocumentFactory({
        scenario: 'Nonstandard J',
      });
      const customMessages = extractCustomMessages(
        exexternalDocumentJDoc.getValidationRules(),
      );
      expect(exexternalDocumentJDoc.getFormattedValidationErrors()).toEqual({
        category: customMessages.category[0],
        documentType: customMessages.documentType[0],
        freeText: customMessages.freeText[0],
        freeText2: customMessages.freeText2[0],
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
      const customMessages = extractCustomMessages(
        externalDocumentJ.getValidationRules(),
      );
      expect(externalDocumentJ.getFormattedValidationErrors()).toEqual({
        freeText: customMessages.freeText[1],
        freeText2: customMessages.freeText2[1],
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
      const customMessages = extractCustomMessages(
        externalDocumentJ.getValidationRules(),
      );
      expect(externalDocumentJ.getFormattedValidationErrors()).toEqual({
        documentTitle: customMessages.documentTitle[0],
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
