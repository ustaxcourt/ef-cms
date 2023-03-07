const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');
const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');
const { getTextByCount } = require('../../utilities/getTextByCount');

describe('ExternalDocumentNonStandardF', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory({
        scenario: 'Nonstandard F',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: VALIDATION_ERROR_MESSAGES.category,
        documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
        ordinalValue: VALIDATION_ERROR_MESSAGES.ordinalValue,
        previousDocument: VALIDATION_ERROR_MESSAGES.previousDocument,
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: '[First, Second, etc.] Amended [Document Name]',
        documentType: 'Amended',
        ordinalValue: 'First',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard F',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: getTextByCount(3001),
        documentType: 'Amended',
        ordinalValue: 'First',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard F',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        documentTitle: VALIDATION_ERROR_MESSAGES.documentTitle,
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title with previousDocument documentType', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: '[First, Second, etc.] Amended [Document Name]',
        documentType: 'Amended',
        ordinalValue: '1',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard F',
      });
      expect(extDoc.getDocumentTitle()).toEqual('First Amended Petition');
    });

    it('should generate valid title with previousDocument documentTitle', () => {
      const extDoc = ExternalDocumentFactory({
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
      expect(extDoc.getDocumentTitle()).toEqual(
        'First Amended Stipulation Something',
      );
    });

    it('should generate title without previousDocument', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: '[First, Second, etc.] Amended [Document Name]',
        documentType: 'Amended',
        ordinalValue: '1',
        scenario: 'Nonstandard F',
      });
      expect(extDoc.getDocumentTitle()).toEqual('First Amended');
    });

    it('should generate title with an otherIteration defined when ordinalValue is "Other"', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Miscellaneous',
        documentTitle: '[First, Second, etc.] Amended [Document Name]',
        documentType: 'Amended',
        ordinalValue: 'Other',
        otherIteration: '50',
        scenario: 'Nonstandard F',
      });
      expect(extDoc.getDocumentTitle()).toEqual('Fiftieth Amended');
    });
  });
});
