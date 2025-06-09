import { CourtIssuedDocumentFactory } from './CourtIssuedDocumentFactory';
import {
  calculateISODate,
  createISODateString,
  formatDateString,
  FORMATS,
  getBusinessDateInFuture,
} from '../../utilities/DateHandler';

const oneMonthFromNow = getBusinessDateInFuture({
  numberOfDays: 30,
  outputFormat: FORMATS.ISO,
  startDate: createISODateString(),
});

describe('CourtIssuedDocumentTypeE', () => {
  describe('constructor', () => {
    it('should set attachments to false when no value is provided', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        date: oneMonthFromNow,
        documentTitle:
          'Order time is extended to [Date] for petr(s) to pay the filing fee',
        documentType:
          'Order time is extended for petr(s) to pay the filing fee',
        scenario: 'Type E',
      });
      expect(documentInstance.attachments).toBe(false);
    });
  });
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        scenario: 'Type E',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        date: 'Enter a date',
        documentType: 'Select a document type',
      });
    });

    it('should have error message for past date if it is a new document', () => {
      const date = calculateISODate({
        dateString: createISODateString(),
        howMuch: -5,
        units: 'days',
      });
      const extDoc = CourtIssuedDocumentFactory({
        attachments: false,
        date,
        documentTitle:
          'Order time is extended to [Date] for petr(s) to pay the filing fee',
        documentType:
          'Order time is extended for petr(s) to pay the filing fee',
        scenario: 'Type E',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        date: 'Due date cannot be prior to today. Enter a valid date.',
      });
    });

    it('should NOT have error message for past date if it is NOT a new document', () => {
      const date = calculateISODate({
        dateString: createISODateString(),
        howMuch: -5,
        units: 'days',
      });
      const extDoc = CourtIssuedDocumentFactory({
        attachments: false,
        createdAt: createISODateString(),
        date,
        documentTitle:
          'Order time is extended to [Date] for petr(s) to pay the filing fee',
        documentType:
          'Order time is extended for petr(s) to pay the filing fee',
        scenario: 'Type E',
      });

      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be valid when all fields are present', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        attachments: false,
        date: oneMonthFromNow,
        documentTitle:
          'Order time is extended to [Date] for petr(s) to pay the filing fee',
        documentType:
          'Order time is extended for petr(s) to pay the filing fee',
        scenario: 'Type E',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });

    describe('requiring filing dates on unservable documents', () => {
      it('should be invalid when filingDate is undefined on an unservable document', () => {
        const documentInstance = CourtIssuedDocumentFactory({
          attachments: false,
          date: oneMonthFromNow,

          documentTitle: '[Anything]',
          documentType: 'USCA',
          eventCode: 'USCA',
          scenario: 'Type E',
        });
        expect(
          documentInstance.getFormattedValidationErrors()!.filingDate,
        ).toBeDefined();
      });

      it('should be valid when filingDate is defined on an unservable document', () => {
        const documentInstance = CourtIssuedDocumentFactory({
          attachments: false,
          date: oneMonthFromNow,

          documentTitle: '[Anything]',
          documentType: 'USCA',
          eventCode: 'USCA',
          filingDate: '1990-01-01T05:00:00.000Z',
          scenario: 'Type E',
        });
        expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const oneMonthFromNowInExpectedFormat = formatDateString(
        oneMonthFromNow,
        FORMATS.MMDDYYYY_DASHED,
      );
      const extDoc = CourtIssuedDocumentFactory({
        attachments: false,
        date: oneMonthFromNow,
        documentTitle:
          'Order time is extended to [Date] for petr(s) to pay the filing fee',
        documentType:
          'Order time is extended for petr(s) to pay the filing fee',
        scenario: 'Type E',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        `Order time is extended to ${oneMonthFromNowInExpectedFormat} for petr(s) to pay the filing fee`,
      );
    });
  });
});
