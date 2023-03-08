const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');
const { UNSERVABLE_EVENT_CODES } = require('../EntityConstants');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

describe('CourtIssuedDocumentDefault', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        scenario: null,
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        documentTitle: VALIDATION_ERROR_MESSAGES.documentTitle,
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
      });
    });

    it('should have error messages for missing fields for an unservable document', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        eventCode: UNSERVABLE_EVENT_CODES[0],
        scenario: null,
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        documentTitle: VALIDATION_ERROR_MESSAGES.documentTitle,
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
        filingDate: VALIDATION_ERROR_MESSAGES.filingDate,
      });
    });

    it('should be valid when all fields are present', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        documentTitle: '[Anything]',
        documentType: 'Order',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be valid when all fields are present for an unservable document', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        documentTitle: 'Some Title',
        documentType: 'U.S.C.A. Something',
        eventCode: UNSERVABLE_EVENT_CODES[0],
        filingDate: '2019-03-01T21:40:46.415Z',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when filingDate is undefined and eventCode is for an unservable document', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        documentTitle: 'Corrected Transcript of [Anything] on [Date]',
        documentType: 'Corrected Transcript',
        eventCode: UNSERVABLE_EVENT_CODES[1],
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        filingDate: VALIDATION_ERROR_MESSAGES.filingDate,
      });
    });
  });

  describe('getDocumentTitle', () => {
    it('should get the document title', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        documentTitle: 'Loaded Cheese Fries',
        documentType: 'Order',
      });
      expect(documentInstance.getDocumentTitle()).toEqual(
        'Loaded Cheese Fries',
      );
    });
  });
});
