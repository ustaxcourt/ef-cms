const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');
const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');
const { getTextByCount } = require('../../utilities/getTextByCount');

describe('ExternalDocumentNonStandardH', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory({
        scenario: 'Nonstandard H',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: VALIDATION_ERROR_MESSAGES.category,
        documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
        secondaryDocument: {
          category: VALIDATION_ERROR_MESSAGES.category,
          documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
        },
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Motion',
        documentTitle: 'Motion for Leave to File [Document Name]',
        documentType: 'Motion for Leave to File',
        scenario: 'Nonstandard H',
        secondaryDocument: {
          category: 'Application',
          documentTitle: 'Application for Waiver of Filing Fee',
          documentType: 'Application for Waiver of Filing Fee',
        },
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should have error messages for nonstandard secondary document', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Motion',
        documentTitle: 'Motion for Leave to File [Document Name]',
        documentType: 'Motion for Leave to File',
        scenario: 'Nonstandard H',
        secondaryDocument: {
          scenario: 'Nonstandard A',
        },
      });
      expect(() => extDoc.validate()).toThrow();
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        secondaryDocument: {
          category: VALIDATION_ERROR_MESSAGES.category,
          documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
          previousDocument: VALIDATION_ERROR_MESSAGES.previousDocument,
        },
      });
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Motion',
        documentTitle: getTextByCount(3001),
        documentType: 'Motion for Leave to File',
        scenario: 'Nonstandard H',
        secondaryDocument: {
          category: 'Application',
          documentTitle: 'Application for Waiver of Filing Fee',
          documentType: 'Application for Waiver of Filing Fee',
        },
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        documentTitle: VALIDATION_ERROR_MESSAGES.documentTitle,
      });
    });
  });

  it('should be valid when all nonstandard secondary document fields are present', () => {
    const extDoc = ExternalDocumentFactory({
      category: 'Motion',
      documentTitle: 'Motion for Leave to File [Document Name]',
      documentType: 'Motion for Leave to File',
      scenario: 'Nonstandard H',
      secondaryDocument: {
        category: 'Supporting Document',
        documentTitle: 'Brief in Support of [Document Name]',
        documentType: 'Brief in Support',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard A',
      },
    });
    expect(() => extDoc.validate()).not.toThrow();
    expect(extDoc.getFormattedValidationErrors()).toEqual(null);
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = ExternalDocumentFactory({
        category: 'Motion',
        documentTitle: 'Motion for Leave to File [Document Name]',
        documentType: 'Motion for Leave to File',
        scenario: 'Nonstandard H',
        secondaryDocument: {
          category: 'Supporting Document',
          documentTitle: 'Brief in Support of [Document Name]',
          documentType: 'Brief in Support',
          previousDocument: { documentType: 'Petition' },
          scenario: 'Nonstandard A',
        },
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Motion for Leave to File Brief in Support of Petition',
      );
    });
  });
});
