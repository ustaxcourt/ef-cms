const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

describe('CourtIssuedDocumentDefault', () => {
  describe('validation', () => {
    it.only('should have error messages for missing fields', () => {
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

    it('should be invalid when filingDate is undefined and eventCode is for an unservable document', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        documentTitle: 'Corrected Transcript of [Anything] on [Date]',
        documentType: 'Corrected Transcript',
        eventCode: 'CTRA',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        filingDate: VALIDATION_ERROR_MESSAGES.filingDate,
      });
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
