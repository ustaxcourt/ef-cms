const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');
const { VALIDATION_ERROR_MESSAGES } = require('./validationErrorMessages');

describe('CourtIssuedDocumentTypeC', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const document = CourtIssuedDocumentFactory.get({
        scenario: 'Type C',
      });
      expect(document.getFormattedValidationErrors()).toEqual({
        attachments: VALIDATION_ERROR_MESSAGES.attachments,
        docketNumbers: VALIDATION_ERROR_MESSAGES.docketNumbers,
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
      });
    });

    it('should be valid when all fields are present', () => {
      const document = CourtIssuedDocumentFactory.get({
        attachments: false,
        docketNumbers: '101-19',
        documentTitle:
          'Order that the letter "L" is added to Docket Number [Anything]',
        documentType: 'Order that the letter "L" is added to Docket Number',
        scenario: 'Type C',
      });
      expect(document.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        docketNumbers: '101-19',
        documentTitle:
          'Order that the letter "L" is added to Docket Number [Anything]',
        documentType: 'Order that the letter "L" is added to Docket Number',
        scenario: 'Type C',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Order that the letter "L" is added to Docket Number 101-19',
      );
    });
  });
});
