const {
  calculateISODate,
  createISODateString,
} = require('../../utilities/DateHandler');
const {
  over1000Characters,
} = require('../../test/createTestApplicationContext');
const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

describe('CourtIssuedDocumentTypeD', () => {
  describe('constructor', () => {
    it('should set attachments to false when no value is provided', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        date: '2025-04-10T04:00:00.000Z',
        documentTitle:
          'Order for Amended Petition and Filing Fee on [Date] [Anything]',
        documentType: 'Order for Amended Petition and Filing Fee',
        freeText: 'Some free text',
        scenario: 'Type D',
      });

      expect(documentInstance.attachments).toBe(false);
    });
  });

  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        scenario: 'Type D',
      });

      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        date: VALIDATION_ERROR_MESSAGES.date[2],
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
      });
    });

    it('should have error message for past date', () => {
      const date = calculateISODate({
        dateString: createISODateString(),
        howMuch: -5,
        unit: 'days',
      });
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        date,
        documentTitle:
          'Order for Amended Petition and Filing Fee on [Date] [Anything]',
        documentType: 'Order for Amended Petition and Filing Fee',
        freeText: 'Some free text',
        scenario: 'Type D',
      });

      expect(extDoc.getFormattedValidationErrors()).toEqual({
        date: VALIDATION_ERROR_MESSAGES.date[0].message,
      });
    });

    it('should be valid when all fields are present', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        attachments: false,
        date: '2025-04-10T04:00:00.000Z',
        documentTitle:
          'Order for Amended Petition and Filing Fee on [Date] [Anything]',
        documentType: 'Order for Amended Petition and Filing Fee',
        freeText: 'Some free text',
        scenario: 'Type D',
      });

      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when freeText is over 1000 characters', () => {
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        date: '2025-04-10T04:00:00.000Z',
        documentTitle:
          'Order for Amended Petition and Filing Fee on [Date] [Anything]',
        documentType: 'Order for Amended Petition and Filing Fee',
        freeText: over1000Characters,
        scenario: 'Type D',
      });

      expect(extDoc.getFormattedValidationErrors()).toEqual({
        freeText: VALIDATION_ERROR_MESSAGES.freeText[1].message,
      });
    });

    describe('requiring filing dates on unservable documents', () => {
      it('should be invalid when filingDate is undefined on an unservable document', () => {
        const documentInstance = CourtIssuedDocumentFactory.get({
          attachments: false,
          date: '2025-04-10T04:00:00.000Z',

          documentTitle: '[Anything]',
          documentType: 'USCA',
          eventCode: 'USCA',
          scenario: 'Type D',
        });

        expect(
          documentInstance.getFormattedValidationErrors().filingDate,
        ).toBeDefined();
      });

      it('should be valid when filingDate is defined on an unservable document', () => {
        const documentInstance = CourtIssuedDocumentFactory.get({
          attachments: false,
          date: '2025-04-10T04:00:00.000Z',

          documentTitle: '[Anything]',
          documentType: 'USCA',
          eventCode: 'USCA',
          filingDate: '1990-01-01T05:00:00.000Z',
          scenario: 'Type D',
        });

        expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        date: '2025-04-10T04:00:00.000Z',
        documentTitle:
          'Order for Amended Petition and Filing Fee on [Date] [Anything]',
        documentType: 'Order for Amended Petition and Filing Fee',
        freeText: 'Some free text',
        scenario: 'Type D',
      });

      expect(extDoc.getDocumentTitle()).toEqual(
        'Order for Amended Petition and Filing Fee on 04-10-2025 Some free text',
      );
    });

    it('should generate valid title without optional freeText', () => {
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        date: '2025-04-10T04:00:00.000Z',
        documentTitle:
          'Order for Amended Petition and Filing Fee on [Date] [Anything]',
        documentType: 'Order for Amended Petition and Filing Fee',
        scenario: 'Type D',
      });

      expect(extDoc.getDocumentTitle()).toEqual(
        'Order for Amended Petition and Filing Fee on 04-10-2025',
      );
    });
  });
});
