const { calculateISODate } = require('../../utilities/DateHandler');
const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

describe('CourtIssuedDocumentTypeH', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const document = CourtIssuedDocumentFactory.get({
        scenario: 'Type H',
      });
      expect(document.getFormattedValidationErrors()).toEqual({
        attachments: VALIDATION_ERROR_MESSAGES.attachments,
        date: VALIDATION_ERROR_MESSAGES.date[2],
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
        freeText: VALIDATION_ERROR_MESSAGES.freeText,
      });
    });

    it('should have error message for future date', () => {
      const date = calculateISODate({ howMuch: 5, unit: 'days' });
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        date,
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        freeText: 'Some free text',
        scenario: 'Type H',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        date: VALIDATION_ERROR_MESSAGES.date[1].message,
      });
    });

    it('should be valid when all fields are present', () => {
      const document = CourtIssuedDocumentFactory.get({
        attachments: false,
        date: '2019-04-10T04:00:00.000Z',
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        freeText: 'Some free text',
        scenario: 'Type H',
      });
      expect(document.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        date: '2019-04-10T04:00:00.000Z',
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        freeText: 'Some free text',
        scenario: 'Type H',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Transcript of Some free text on 04-10-2019',
      );
    });
  });
});
