import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('ExternalDocumentNonStandardB', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const externalDocumentB = ExternalDocumentFactory({
        scenario: 'Nonstandard B',
      });

      expect(externalDocumentB.getFormattedValidationErrors()).toEqual({
        category: 'Select a Category.',
        documentType: 'Select a document type',
        freeText: 'Provide an answer',
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
          'Document title must be 3000 characters or fewer. Update this document title and try again.',
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
      freeText: 'Limit is 1000 characters. Enter 1000 or fewer characters.',
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
