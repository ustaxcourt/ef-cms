const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');
const { VALIDATION_ERROR_MESSAGES } = require('./validationErrorMessages');

describe('CourtIssuedDocumentTypeB', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const document = CourtIssuedDocumentFactory.get({
        scenario: 'Type B',
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
        scenario: 'Type B',
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
        scenario: 'Type B',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Order that case is assigned to Judge Armen Some free text',
      );
    });
  });
});
