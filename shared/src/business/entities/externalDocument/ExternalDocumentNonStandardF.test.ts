import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('ExternalDocumentNonStandardF', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const externalDocumentF = ExternalDocumentFactory({
        scenario: 'Nonstandard F',
      });

      expect(externalDocumentF.getFormattedValidationErrors()).toEqual({
        category: 'Select a Category.',
        documentType: 'Select a document type',
        ordinalValue: 'Select an iteration',
        previousDocument: 'Select a document',
      });
    });

    it('should be valid when all fields are present', () => {
      const externalDocumentF = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: '[First, Second, etc.] Amended [Document Name]',
        documentType: 'Amended',
        ordinalValue: 'First',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard F',
      });

      expect(externalDocumentF.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const externalDocumentF = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: getTextByCount(3001),
        documentType: 'Amended',
        ordinalValue: 'First',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard F',
      });

      expect(externalDocumentF.getFormattedValidationErrors()).toEqual({
        documentTitle:
          'Document title must be 3000 characters or fewer. Update this document title and try again.',
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title with previousDocument documentType', () => {
      const externalDocumentF = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: '[First, Second, etc.] Amended [Document Name]',
        documentType: 'Amended',
        ordinalValue: '1',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard F',
      });

      expect(externalDocumentF.getDocumentTitle()).toEqual(
        'First Amended Petition',
      );
    });

    it('should generate valid title with previousDocument documentTitle', () => {
      const externalDocumentF = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: '[First, Second, etc.] Amended [Document Name]',
        documentType: 'Amended',
        ordinalValue: '1',
        previousDocument: {
          documentTitle: 'Stipulation Something',
          documentType: 'Stipulation',
        },
        scenario: 'Nonstandard F',
      });

      expect(externalDocumentF.getDocumentTitle()).toEqual(
        'First Amended Stipulation Something',
      );
    });

    it('should generate title without previousDocument', () => {
      const externalDocumentF = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: '[First, Second, etc.] Amended [Document Name]',
        documentType: 'Amended',
        ordinalValue: '1',
        scenario: 'Nonstandard F',
      });

      expect(externalDocumentF.getDocumentTitle()).toEqual('First Amended');
    });

    it('should generate title with an otherIteration defined when ordinalValue is "Other"', () => {
      const externalDocumentF = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: '[First, Second, etc.] Amended [Document Name]',
        documentType: 'Amended',
        ordinalValue: 'Other',
        otherIteration: 50,
        scenario: 'Nonstandard F',
      });

      expect(externalDocumentF.getDocumentTitle()).toEqual('Fiftieth Amended');
    });
  });
});
