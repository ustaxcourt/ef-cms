import { CourtIssuedDocumentFactory } from './CourtIssuedDocumentFactory';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('CourtIssuedDocumentTypeC', () => {
  describe('constructor', () => {
    it('should set attachments to false when no value is provided', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        docketNumbers: '101-19',
        documentTitle:
          'Order that the letter "L" is added to Docket Number [Anything]',
        documentType: 'Order that the letter "L" is added to Docket Number',
        scenario: 'Type C',
      });
      expect(documentInstance.attachments).toBe(false);
    });
  });

  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        scenario: 'Type C',
      });
      const customMessages = extractCustomMessages(
        documentInstance.getValidationRules(),
      );
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        docketNumbers: customMessages.docketNumbers[0],
        documentType: customMessages.documentType[0],
      });
    });

    it('should be valid when all fields are present', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        attachments: false,
        docketNumbers: '101-19',
        documentTitle:
          'Order that the letter "L" is added to Docket Number [Anything]',
        documentType: 'Order that the letter "L" is added to Docket Number',
        scenario: 'Type C',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when docketNumbers field is over 500 characters', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        attachments: false,
        docketNumbers: getTextByCount(1001),
        documentTitle:
          'Order that the letter "L" is added to Docket Number [Anything]',
        documentType: 'Order that the letter "L" is added to Docket Number',
        scenario: 'Type C',
      });
      const customMessages = extractCustomMessages(
        documentInstance.getValidationRules(),
      );
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        docketNumbers: customMessages.docketNumbers[1],
      });
    });

    describe('requiring filing dates on unservable documents', () => {
      it('should be invalid when filingDate is undefined on an unservable document', () => {
        const documentInstance = CourtIssuedDocumentFactory({
          attachments: false,
          docketNumbers: '101-19',

          documentTitle: '[Anything]',
          documentType: 'USCA',
          eventCode: 'USCA',
          scenario: 'Type C',
        });
        expect(
          documentInstance.getFormattedValidationErrors()!.filingDate,
        ).toBeDefined();
      });

      it('should be valid when filingDate is defined on an unservable document', () => {
        const documentInstance = CourtIssuedDocumentFactory({
          attachments: false,
          docketNumbers: '101-19',

          documentTitle: '[Anything]',
          documentType: 'USCA',
          eventCode: 'USCA',
          filingDate: '1990-01-01T05:00:00.000Z',
          scenario: 'Type C',
        });
        expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = CourtIssuedDocumentFactory({
        attachments: false,
        docketNumbers: '101-19',
        documentTitle:
          'Order that the letter "L" is added to Docket Number [Anything]',
        documentType: 'Order that the letter "L" is added to Docket Number',
        scenario: 'Type C',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Order that the letter "L" is added to Docket Number 101-19',
      );
    });
  });
});
