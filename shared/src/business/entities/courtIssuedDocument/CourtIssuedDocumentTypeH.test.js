const { calculateISODate } = require('../../utilities/DateHandler');
const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

describe('CourtIssuedDocumentTypeH', () => {
  describe('constructor', () => {
    it('should set attachments to false when no value is provided', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        date: '2019-04-10T04:00:00.000Z',
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        freeText: 'Some free text',
        scenario: 'Type H',
      });
      expect(documentInstance.attachments).toBe(false);
    });
  });
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        scenario: 'Type H',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
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
      const documentInstance = CourtIssuedDocumentFactory.get({
        attachments: false,
        date: '2019-04-10T04:00:00.000Z',
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        freeText: 'Some free text',
        scenario: 'Type H',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });

    describe('requiring filing dates on unservable documents', () => {
      it('should be invalid when filingDate is undefined on an unservable document', () => {
        const documentInstance = CourtIssuedDocumentFactory.get({
          attachments: false,
          date: '2019-04-10T04:00:00.000Z',
          documentTitle: '[Anything]',
          documentType: 'USCA',
          eventCode: 'USCA',
          freeText: 'Some free text',
          scenario: 'Type H',
        });
        expect(
          documentInstance.getFormattedValidationErrors().filingDate,
        ).toBeDefined();
      });

      it('should be valid when filingDate is defined on an unservable document', () => {
        const documentInstance = CourtIssuedDocumentFactory.get({
          attachments: false,
          date: '2019-04-10T04:00:00.000Z',
          documentTitle: '[Anything]',
          documentType: 'USCA',
          eventCode: 'USCA',
          filingDate: '1990-01-01T05:00:00.000Z',
          freeText: 'Some free text',
          scenario: 'Type H',
        });
        expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
      });
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
