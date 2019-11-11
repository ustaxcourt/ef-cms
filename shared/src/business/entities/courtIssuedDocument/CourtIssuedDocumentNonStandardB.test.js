const {
  CourtIssuedDocumentNonStandardB,
} = require('./CourtIssuedDocumentNonStandardB');
const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');

const { VALIDATION_ERROR_MESSAGES } = CourtIssuedDocumentNonStandardB;

describe('CourtIssuedDocumentNonStandardB', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const document = CourtIssuedDocumentFactory.get({
        scenario: 'Nonstandard B',
      });
      expect(document.getFormattedValidationErrors()).toEqual({
        attachments: VALIDATION_ERROR_MESSAGES.attachments,
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
        freeText: VALIDATION_ERROR_MESSAGES.freeText,
        judge: VALIDATION_ERROR_MESSAGES.judge,
      });
    });

    it('should be valid when all fields are present', () => {
      const document = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: 'Order that case is assigned to [Judge Name] [Anything]',
        documentType: 'Order that case is assigned',
        freeText: 'Some free text',
        judge: 'Judge Armen',
        scenario: 'Nonstandard B',
      });
      expect(document.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: 'Order that case is assigned to [Judge Name] [Anything]',
        documentType: 'Order that case is assigned',
        freeText: 'Some free text',
        judge: 'Judge Armen',
        scenario: 'Nonstandard B',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Order that case is assigned to Judge Armen Some free text',
      );
    });
  });
});
