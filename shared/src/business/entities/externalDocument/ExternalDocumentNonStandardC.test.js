const {
  ExternalDocumentNonStandardC,
} = require('./ExternalDocumentNonStandardC');
const {
  over1000Characters,
  over3000Characters,
} = require('../../test/createTestApplicationContext');
const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

const { VALIDATION_ERROR_MESSAGES } = ExternalDocumentNonStandardC;

describe('ExternalDocumentNonStandardC', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard C',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: VALIDATION_ERROR_MESSAGES.category,
        documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
        freeText: VALIDATION_ERROR_MESSAGES.freeText[0].message,
        previousDocument: VALIDATION_ERROR_MESSAGES.previousDocument,
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: 'Affidavit Of [Name] in Support Of [Document Name]',
        documentType: 'Affidavit in Support',
        freeText: 'Lori Loughlin',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard C',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when freeText is over 1000 characters', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: 'Affidavit Of [Name] in Support Of [Document Name]',
        documentType: 'Affidavit in Support',
        freeText: over1000Characters,
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard C',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        freeText:
          ExternalDocumentNonStandardC.VALIDATION_ERROR_MESSAGES.freeText[1]
            .message,
      });
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: over3000Characters,
        documentType: 'Affidavit in Support',
        freeText: 'what',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard C',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        documentTitle: VALIDATION_ERROR_MESSAGES.documentTitle,
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title with previousDocument documentType', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: 'Affidavit Of [Name] in Support Of [Document Name]',
        documentType: 'Affidavit in Support',
        freeText: 'Lori Loughlin',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard C',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Affidavit Of Lori Loughlin in Support Of Petition',
      );
    });

    it('should generate valid title with previousDocument documentTitle', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: 'Affidavit Of [Name] in Support Of [Document Name]',
        documentType: 'Affidavit in Support',
        freeText: 'Lori Loughlin',
        previousDocument: {
          documentTitle: 'Stipulation Something',
          documentType: 'Stipulation',
        },
        scenario: 'Nonstandard C',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Affidavit Of Lori Loughlin in Support Of Stipulation Something',
      );
    });

    it('should generate title without previousDocument', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Supporting Document',
        documentTitle: 'Affidavit Of [Name] in Support Of [Document Name]',
        documentType: 'Affidavit in Support',
        freeText: 'Lori Loughlin',
        scenario: 'Nonstandard C',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Affidavit Of Lori Loughlin in Support Of',
      );
    });
  });
});
