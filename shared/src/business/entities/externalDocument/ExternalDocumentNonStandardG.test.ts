import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('ExternalDocumentNonStandardG', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const externalDocumentG = ExternalDocumentFactory({
        scenario: 'Nonstandard G',
      });

      expect(externalDocumentG.getFormattedValidationErrors()).toEqual({
        category: 'Select a Category.',
        documentType: 'Select a document type',
        ordinalValue: 'Select an iteration',
      });
    });

    it('should be valid when all fields are present', () => {
      const externalDocumentG = ExternalDocumentFactory({
        category: 'Answer',
        documentTitle: '[First, Second, etc.] Amendment to Answer',
        documentType: 'Amendment to Answer',
        ordinalValue: 'First',
        scenario: 'Nonstandard G',
      });

      expect(externalDocumentG.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const externalDocumentG = ExternalDocumentFactory({
        category: 'Answer',
        documentTitle: getTextByCount(3001),
        documentType: 'Amendment to Answer',
        ordinalValue: 'First',
        scenario: 'Nonstandard G',
      });

      expect(externalDocumentG.getFormattedValidationErrors()).toEqual({
        documentTitle:
          'Document title must be 3000 characters or fewer. Update this document title and try again.',
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const externalDocumentG = ExternalDocumentFactory({
        category: 'Answer',
        documentTitle: '[First, Second, etc.] Amendment to Answer',
        documentType: 'Amendment to Answer',
        ordinalValue: '1',
        scenario: 'Nonstandard G',
      });

      expect(externalDocumentG.getDocumentTitle()).toEqual(
        'First Amendment to Answer',
      );
    });

    it('should generate title with an otherIteration defined when ordinalValue is "Other"', () => {
      const externalDocumentG = ExternalDocumentFactory({
        category: 'Answer',
        documentTitle: '[First, Second, etc.] Amendment to Answer',
        documentType: 'Amendment to Answer',
        ordinalValue: 'Other',
        otherIteration: 50,
        scenario: 'Nonstandard G',
      });

      expect(externalDocumentG.getDocumentTitle()).toEqual(
        'Fiftieth Amendment to Answer',
      );
    });
  });
});
