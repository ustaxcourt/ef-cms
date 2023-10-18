import { CourtIssuedDocumentFactory } from './CourtIssuedDocumentFactory';
import { UNSERVABLE_EVENT_CODES } from '../EntityConstants';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';

describe('CourtIssuedDocumentBase', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        scenario: null,
      });
      const customMessages = extractCustomMessages(
        documentInstance.getValidationRules(),
      );
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        documentType: customMessages.documentType[0],
      });
    });

    it('should have error messages for missing fields for an unservable document', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        eventCode: UNSERVABLE_EVENT_CODES[0],
        scenario: null,
      });
      const customMessages = extractCustomMessages(
        documentInstance.getValidationRules(),
      );
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        documentType: customMessages.documentType[0],
        filingDate: customMessages.filingDate[0],
      });
    });

    it('should be valid when all fields are present', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        documentTitle: '[Anything]',
        documentType: 'Order',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be valid when all fields are present for an unservable document', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        documentTitle: 'Some Title',
        documentType: 'U.S.C.A. Something',
        eventCode: UNSERVABLE_EVENT_CODES[0],
        filingDate: '2019-03-01T21:40:46.415Z',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when filingDate is undefined and eventCode is for an unservable document', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        documentTitle: 'Corrected Transcript of [Anything] on [Date]',
        documentType: 'Corrected Transcript',
        eventCode: UNSERVABLE_EVENT_CODES[1],
      });
      const customMessages = extractCustomMessages(
        documentInstance.getValidationRules(),
      );
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        filingDate: customMessages.filingDate[0],
      });
    });
  });

  describe('getDocumentTitle', () => {
    it('should get the document title', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        documentTitle: 'Loaded Cheese Fries',
        documentType: 'Order',
      });
      expect(documentInstance.getDocumentTitle()).toEqual(
        'Loaded Cheese Fries',
      );
    });
  });
});
