const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

describe('CourtIssuedDocumentDefault', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const document = CourtIssuedDocumentFactory.get({
        scenario: null,
      });
      expect(document.getFormattedValidationErrors()).toEqual({
        documentTitle: VALIDATION_ERROR_MESSAGES.documentTitle,
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
      });
    });

    it('should be valid when all fields are present', () => {
      const document = CourtIssuedDocumentFactory.get({
        documentTitle: '[Anything]',
        documentType: 'Order',
      });
      expect(document.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('getDocumentTitle', () => {
    it('should get the document title', () => {
      const document = CourtIssuedDocumentFactory.get({
        documentTitle: 'Loaded Cheese Fries',
        documentType: 'Order',
      });
      expect(document.getDocumentTitle()).toEqual('Loaded Cheese Fries');
    });
  });
});
