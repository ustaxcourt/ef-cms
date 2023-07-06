import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { ExternalDocumentNonStandardI } from './ExternalDocumentNonStandardI';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('ExternalDocumentNonStandardI', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const externalDocumentI = ExternalDocumentFactory({
        scenario: 'Nonstandard I',
      });

      expect(externalDocumentI.getFormattedValidationErrors()).toEqual({
        category:
          ExternalDocumentNonStandardI.VALIDATION_ERROR_MESSAGES.category,
        documentType:
          ExternalDocumentNonStandardI.VALIDATION_ERROR_MESSAGES
            .documentType[1],
        freeText:
          ExternalDocumentNonStandardI.VALIDATION_ERROR_MESSAGES.freeText[0]
            .message,
        ordinalValue:
          ExternalDocumentNonStandardI.VALIDATION_ERROR_MESSAGES.ordinalValue,
      });
    });

    it('should be valid when all fields are present', () => {
      const externalDocumentI = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: '[First, Second, etc.] Amendment to [anything]',
        documentType: 'Amendment [anything]',
        freeText: 'Test',
        ordinalValue: 'First',
        scenario: 'Nonstandard I',
      });

      expect(externalDocumentI.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when freeText is over 1000 characters', () => {
      const externalDocumentI = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: '[First, Second, etc.] Amendment to [anything]',
        documentType: 'Amendment [anything]',
        freeText: getTextByCount(1001),
        ordinalValue: 'First',
        scenario: 'Nonstandard I',
      });

      expect(externalDocumentI.getFormattedValidationErrors()).toEqual({
        freeText:
          ExternalDocumentNonStandardI.VALIDATION_ERROR_MESSAGES.freeText[1]
            .message,
      });
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const externalDocumentI = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: getTextByCount(3001),
        documentType: 'Amendment [anything]',
        freeText: 'Test',
        ordinalValue: 'First',
        scenario: 'Nonstandard I',
      });

      expect(externalDocumentI.getFormattedValidationErrors()).toEqual({
        documentTitle:
          ExternalDocumentNonStandardI.VALIDATION_ERROR_MESSAGES.documentTitle,
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const externalDocumentI = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: '[First, Second, etc.] Amendment to [anything]',
        documentType: 'Amendment [anything]',
        freeText: 'Test',
        ordinalValue: '1',
        scenario: 'Nonstandard I',
      });

      expect(externalDocumentI.getDocumentTitle()).toEqual(
        'First Amendment to Test',
      );
    });

    it('should generate title with an otherIteration defined when ordinalValue is "Other"', () => {
      const externalDocumentI = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: '[First, Second, etc.] Amendment to [anything]',
        documentType: 'Amendment [anything]',
        freeText: 'Test',
        ordinalValue: 'Other',
        otherIteration: 50,
        scenario: 'Nonstandard I',
      });

      expect(externalDocumentI.getDocumentTitle()).toEqual(
        'Fiftieth Amendment to Test',
      );
    });
  });
});
