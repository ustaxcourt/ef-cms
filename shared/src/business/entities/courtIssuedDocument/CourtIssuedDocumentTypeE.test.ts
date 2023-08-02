import { CourtIssuedDocumentFactory } from './CourtIssuedDocumentFactory';
import { VALIDATION_ERROR_MESSAGES } from './CourtIssuedDocumentConstants';
import {
  calculateISODate,
  createISODateString,
} from '../../utilities/DateHandler';

describe('CourtIssuedDocumentTypeE', () => {
  describe('constructor', () => {
    it('should set attachments to false when no value is provided', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        date: '2025-04-10T04:00:00.000Z',
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
        date: VALIDATION_ERROR_MESSAGES.date[2],
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
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
        date: VALIDATION_ERROR_MESSAGES.date[0].message,
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
        date: '2025-04-10T04:00:00.000Z',
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
          date: '2025-04-10T04:00:00.000Z',

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
          date: '2025-04-10T04:00:00.000Z',

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
      const extDoc = CourtIssuedDocumentFactory({
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
});
