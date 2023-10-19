import { CourtIssuedDocumentFactory } from './CourtIssuedDocumentFactory';
import { calculateISODate } from '../../utilities/DateHandler';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('CourtIssuedDocumentTypeH', () => {
  describe('constructor', () => {
    it('should set attachments to false when no value is provided', () => {
      const documentInstance = CourtIssuedDocumentFactory({
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
      const documentInstance = CourtIssuedDocumentFactory({
        scenario: 'Type H',
      });
      const customMessages = extractCustomMessages(
        documentInstance.getValidationRules(),
      );
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        date: customMessages.date[0],
        documentType: customMessages.documentType[0],
        freeText: customMessages.freeText[0],
      });
    });

    it('should have error message for future date', () => {
      const date = calculateISODate({ howMuch: 5, units: 'days' });
      const extDoc = CourtIssuedDocumentFactory({
        attachments: false,
        date,
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        freeText: 'Some free text',
        scenario: 'Type H',
      });
      const customMessages = extractCustomMessages(extDoc.getValidationRules());
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        date: customMessages.date[1],
      });
    });

    it('should be valid when all fields are present', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        attachments: false,
        date: '2019-04-10T04:00:00.000Z',
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        freeText: 'Some free text',
        scenario: 'Type H',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });

    it('should throw an error when the freeText is over 1000 characters', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        attachments: false,
        date: '2019-04-10T04:00:00.000Z',
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        freeText: getTextByCount(1001),
        scenario: 'Type H',
      });
      const customMessages = extractCustomMessages(
        documentInstance.getValidationRules(),
      );
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        freeText: customMessages.freeText[1],
      });
    });

    describe('requiring filing dates on unservable documents', () => {
      it('should be invalid when filingDate is undefined on an unservable document', () => {
        const documentInstance = CourtIssuedDocumentFactory({
          attachments: false,
          date: '2019-04-10T04:00:00.000Z',
          documentTitle: '[Anything]',
          documentType: 'USCA',
          eventCode: 'USCA',
          freeText: 'Some free text',
          scenario: 'Type H',
        });
        expect(
          documentInstance.getFormattedValidationErrors()!.filingDate,
        ).toBeDefined();
      });

      it('should be valid when filingDate is defined on an unservable document', () => {
        const documentInstance = CourtIssuedDocumentFactory({
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
      const extDoc = CourtIssuedDocumentFactory({
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
