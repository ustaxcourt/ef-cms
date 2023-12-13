import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('ExternalDocumentNonStandardJ', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const exexternalDocumentJDoc = ExternalDocumentFactory({
        scenario: 'Nonstandard J',
      });

      expect(exexternalDocumentJDoc.getFormattedValidationErrors()).toEqual({
        category: 'Select a Category.',
        documentType: 'Select a document type',
        freeText: 'Provide an answer',
        freeText2: 'Provide an answer',
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
        freeText: 'Limit is 1000 characters. Enter 1000 or fewer characters.',
        freeText2: 'Limit is 1000 characters. Enter 1000 or fewer characters.',
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
          'Document title must be 3000 characters or fewer. Update this document title and try again.',
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
