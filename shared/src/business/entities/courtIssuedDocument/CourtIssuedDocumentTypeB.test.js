const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

describe('CourtIssuedDocumentTypeB', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        scenario: 'Type B',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        attachments: VALIDATION_ERROR_MESSAGES.attachments,
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
        judge: VALIDATION_ERROR_MESSAGES.judge,
      });
    });

    it('should be valid when all fields are present', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: 'Order that case is assigned to [Judge Name] [Anything]',
        documentType: 'Order that case is assigned',
        freeText: 'Some free text',
        judge: 'Judge Colvin',
        scenario: 'Type B',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: 'Order that case is assigned to [Judge Name] [Anything]',
        documentType: 'Order that case is assigned',
        freeText: 'Some free text',
        judge: 'Judge Colvin',
        scenario: 'Type B',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Order that case is assigned to Judge Colvin Some free text',
      );
    });

    it('should generate valid title without optional freeText', () => {
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: 'Order that case is assigned to [Judge Name] [Anything]',
        documentType: 'Order that case is assigned',
        judge: 'Judge Colvin',
        scenario: 'Type B',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Order that case is assigned to Judge Colvin',
      );
    });
  });
});
