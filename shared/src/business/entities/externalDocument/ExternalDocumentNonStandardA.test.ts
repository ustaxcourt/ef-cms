import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { ExternalDocumentNonStandardA } from './ExternalDocumentNonStandardA';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('ExternalDocumentNonStandardA', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const externalDocumentA = ExternalDocumentFactory({
        scenario: 'Nonstandard A',
      });

      expect(externalDocumentA.getFormattedValidationErrors()).toEqual({
        category:
          ExternalDocumentNonStandardA.VALIDATION_ERROR_MESSAGES.category,
        documentType:
          ExternalDocumentNonStandardA.VALIDATION_ERROR_MESSAGES
            .documentType[1],
        previousDocument:
          ExternalDocumentNonStandardA.VALIDATION_ERROR_MESSAGES
            .previousDocument,
      });
    });

    it('should be valid when all fields are present', () => {
      const externalDocumentA = ExternalDocumentFactory({
        category: 'Supporting Document',
        documentTitle: 'Brief in Support of [Document Name]',
        documentType: 'Brief in Support',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard A',
      });

      expect(externalDocumentA.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const externalDocumentA = ExternalDocumentFactory({
        category: 'Supporting Document',
        documentTitle: getTextByCount(3001),
        documentType: 'Brief in Support',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard A',
      });

      expect(externalDocumentA.getFormattedValidationErrors()).toEqual({
        documentTitle:
          ExternalDocumentNonStandardA.VALIDATION_ERROR_MESSAGES.documentTitle,
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title with previousDocument documentType', () => {
      const externalDocumentA = ExternalDocumentFactory({
        category: 'Supporting Document',
        documentTitle: 'Brief in Support of [Document Name]',
        documentType: 'Brief in Support',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard A',
      });

      expect(externalDocumentA.getDocumentTitle()).toEqual(
        'Brief in Support of Petition',
      );
    });

    it('should generate valid title with previousDocument documentTitle', () => {
      const externalDocumentA = ExternalDocumentFactory({
        category: 'Supporting Document',
        documentTitle: 'Brief in Support of [Document Name]',
        documentType: 'Brief in Support',
        previousDocument: {
          documentTitle: 'Stipulation Something',
          documentType: 'Stipulation',
        },
        scenario: 'Nonstandard A',
      });

      expect(externalDocumentA.getDocumentTitle()).toEqual(
        'Brief in Support of Stipulation Something',
      );
    });

    it('should generate title without previousDocument', () => {
      const externalDocumentA = ExternalDocumentFactory({
        category: 'Supporting Document',
        documentTitle: 'Brief in Support of [Document Name]',
        documentType: 'Brief in Support',
        scenario: 'Nonstandard A',
      });

      expect(externalDocumentA.getDocumentTitle()).toEqual(
        'Brief in Support of',
      );
    });
  });
});
