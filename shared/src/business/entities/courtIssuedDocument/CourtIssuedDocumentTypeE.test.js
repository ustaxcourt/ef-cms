const {
  calculateISODate,
  createISODateString,
} = require('../../utilities/DateHandler');
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
        date: '2025-04-10T04:00:00.000Z',
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
        date: '2025-04-10T04:00:00.000Z',
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

  describe('Order for Filing Fee. Application waiver of Filing Fee is denied [OFWD]', () => {
    it('should have an error message for any date past the current', () => {
      const date = calculateISODate({
        dateString: createISODateString(),
        howMuch: 5,
        unit: 'days',
      });

      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        date,
        documentTitle:
          'Order for Filing Fee on [Date]. Application waiver of Filing Fee is denied.',
        documentType:
          'Order for Filing Fee. Application waiver of Filing Fee is denied',
        scenario: 'Type E',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        date: VALIDATION_ERROR_MESSAGES.date[0].message,
      });
    });

    it('should not have an error message for the current date', () => {
      const date = createISODateString();

      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        date,
        documentTitle:
          'Order for Filing Fee on [Date]. Application waiver of Filing Fee is denied.',
        documentType:
          'Order for Filing Fee. Application waiver of Filing Fee is denied',
        scenario: 'Type E',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should not have an error message for previous dates', () => {
      const date = calculateISODate({
        dateString: createISODateString(),
        howMuch: -5,
        unit: 'days',
      });

      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        date,
        documentTitle:
          'Order for Filing Fee on [Date]. Application waiver of Filing Fee is denied.',
        documentType:
          'Order for Filing Fee. Application waiver of Filing Fee is denied',
        scenario: 'Type E',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
