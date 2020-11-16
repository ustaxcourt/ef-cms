const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

describe('CourtIssuedDocumentDefault', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        scenario: null,
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        documentTitle: VALIDATION_ERROR_MESSAGES.documentTitle,
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
      });
    });

    it('should be valid when all fields are present', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        documentTitle: '[Anything]',
        documentType: 'Order',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('getDocumentTitle', () => {
    it('should get the document title', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        documentTitle: 'Loaded Cheese Fries',
        documentType: 'Order',
      });
      expect(documentInstance.getDocumentTitle()).toEqual(
        'Loaded Cheese Fries',
      );
    });
  });
});
