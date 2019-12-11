const moment = require('moment');
const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

describe('CourtIssuedDocumentTypeE', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const document = CourtIssuedDocumentFactory.get({
        scenario: 'Type E',
      });
      expect(document.getFormattedValidationErrors()).toEqual({
        attachments: VALIDATION_ERROR_MESSAGES.attachments,
        date: VALIDATION_ERROR_MESSAGES.date[1],
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
      });
    });

    it('should have error message for past date', () => {
      const date = moment()
        .subtract(5, 'days')
        .format();
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        date,
        documentTitle:
          'Order time is extended to [Date] for petr(s) to pay the filing fee',
        documentType:
          'Order time is extended for petr(s) to pay the filing fee',
        scenario: 'Type E',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        date: VALIDATION_ERROR_MESSAGES.date[0].message,
      });
    });

    it('should be valid when all fields are present', () => {
      const document = CourtIssuedDocumentFactory.get({
        attachments: false,
        date: '2025-04-10T00:00:00-05:00',
        documentTitle:
          'Order time is extended to [Date] for petr(s) to pay the filing fee',
        documentType:
          'Order time is extended for petr(s) to pay the filing fee',
        scenario: 'Type E',
      });
      expect(document.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        date: '2025-04-10T00:00:00-05:00',
        documentTitle:
          'Order time is extended to [Date] for petr(s) to pay the filing fee',
        documentType:
          'Order time is extended for petr(s) to pay the filing fee',
        scenario: 'Type E',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Order time is extended to 04-10-2025 for petr(s) to pay the filing fee',
      );
    });
  });
});
