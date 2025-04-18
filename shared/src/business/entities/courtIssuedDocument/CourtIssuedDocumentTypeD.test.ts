import { CourtIssuedDocumentFactory } from './CourtIssuedDocumentFactory';
import {
  calculateISODate,
  createISODateString,
  formatDateString,
  FORMATS,
  getBusinessDateInFuture,
} from '../../utilities/DateHandler';
import { getTextByCount } from '@shared/test/getTextByCount';

const oneMonthFromNow = getBusinessDateInFuture({
  numberOfDays: 30,
  outputFormat: FORMATS.ISO,
  startDate: createISODateString(),
});

const oneMonthFromNowInExpectedFormat = formatDateString(
  oneMonthFromNow,
  FORMATS.MMDDYYYY_DASHED,
);

describe('CourtIssuedDocumentTypeD', () => {
  describe('constructor', () => {
    it('should set attachments to false when no value is provided', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        date: oneMonthFromNow,
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
      const documentInstance = CourtIssuedDocumentFactory({
        scenario: 'Type D',
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
          'Order for Amended Petition and Filing Fee on [Date] [Anything]',
        documentType: 'Order for Amended Petition and Filing Fee',
        freeText: 'Some free text',
        scenario: 'Type D',
      });

      expect(extDoc.getFormattedValidationErrors()).toEqual({
        date: 'Due date cannot be prior to today. Enter a valid date.',
      });
    });

    it('should NOT have error message for past date if it is NOT a new document', () => {
      const date = calculateISODate({
        dateString: createISODateString(),
        howMuch: -5,
      });
      const extDoc = CourtIssuedDocumentFactory({
        attachments: false,
        createdAt: createISODateString(),
        date,
        documentTitle:
          'Order for Amended Petition and Filing Fee on [Date] [Anything]',
        documentType: 'Order for Amended Petition and Filing Fee',
        freeText: 'Some free text',
        scenario: 'Type D',
      });

      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be valid when all fields are present', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        attachments: false,
        date: oneMonthFromNow,
        documentTitle:
          'Order for Amended Petition and Filing Fee on [Date] [Anything]',
        documentType: 'Order for Amended Petition and Filing Fee',
        freeText: 'Some free text',
        scenario: 'Type D',
      });

      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when freeText is over 1000 characters', () => {
      const extDoc = CourtIssuedDocumentFactory({
        attachments: false,
        date: oneMonthFromNow,
        documentTitle:
          'Order for Amended Petition and Filing Fee on [Date] [Anything]',
        documentType: 'Order for Amended Petition and Filing Fee',
        freeText: getTextByCount(1001),
        scenario: 'Type D',
      });

      expect(extDoc.getFormattedValidationErrors()).toEqual({
        freeText: 'Limit is 1000 characters. Enter 1000 or fewer characters.',
      });
    });

    describe('requiring filing dates on unservable documents', () => {
      it('should be invalid when filingDate is undefined on an unservable document', () => {
        const documentInstance = CourtIssuedDocumentFactory({
          attachments: false,
          date: oneMonthFromNow,

          documentTitle: '[Anything]',
          documentType: 'USCA',
          eventCode: 'USCA',
          scenario: 'Type D',
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
          scenario: 'Type D',
        });

        expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = CourtIssuedDocumentFactory({
        attachments: false,
        date: oneMonthFromNow,
        documentTitle:
          'Order for Amended Petition and Filing Fee on [Date] [Anything]',
        documentType: 'Order for Amended Petition and Filing Fee',
        freeText: 'Some free text',
        scenario: 'Type D',
      });

      expect(extDoc.getDocumentTitle()).toEqual(
        `Order for Amended Petition and Filing Fee on ${oneMonthFromNowInExpectedFormat} Some free text`,
      );
    });

    it('should generate valid title without optional freeText', () => {
      const extDoc = CourtIssuedDocumentFactory({
        attachments: false,
        date: oneMonthFromNow,
        documentTitle:
          'Order for Amended Petition and Filing Fee on [Date] [Anything]',
        documentType: 'Order for Amended Petition and Filing Fee',
        scenario: 'Type D',
      });

      expect(extDoc.getDocumentTitle()).toEqual(
        `Order for Amended Petition and Filing Fee on ${oneMonthFromNowInExpectedFormat}`,
      );
    });
  });
});
