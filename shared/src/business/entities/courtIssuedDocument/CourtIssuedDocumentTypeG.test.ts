import { CourtIssuedDocumentFactory } from './CourtIssuedDocumentFactory';
import { TRIAL_SESSION_SCOPE_TYPES } from '../EntityConstants';

describe('CourtIssuedDocumentTypeG', () => {
  describe('constructor', () => {
    it('should set attachments to false when no value is provided', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        date: '2025-04-10T04:00:00.000Z',
        documentTitle: 'Notice of Trial on [Date] at [Place]',
        documentType: 'Notice of Trial',
        scenario: 'Type G',
        trialLocation: 'Seattle, Washington',
      });
      expect(documentInstance.attachments).toBe(false);
    });
  });
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        scenario: 'Type G',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        date: 'Enter a date',
        documentType: 'Select a document type',
        trialLocation: 'Select a trial location',
      });
    });

    it('should have error message for invalid formatted date', () => {
      const extDoc = CourtIssuedDocumentFactory({
        attachments: false,
        date: '04/10/2025',
        documentTitle: 'Notice of Trial on [Date] at [Place]',
        documentType: 'Notice of Trial',
        scenario: 'Type G',
        trialLocation: 'Seattle, Washington',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        date: 'Enter a date',
      });
    });

    it('should be valid when all fields are present', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        attachments: false,
        date: '2025-04-10T04:00:00.000Z',
        documentTitle: 'Notice of Trial on [Date] at [Place]',
        documentType: 'Notice of Trial',
        scenario: 'Type G',
        trialLocation: 'Seattle, Washington',
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
          scenario: 'Type G',
          trialLocation: 'Seattle, Washington',
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
          scenario: 'Type G',
          trialLocation: 'Seattle, Washington',
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
        documentTitle: 'Notice of Trial on [Date] at [Place]',
        documentType: 'Notice of Trial',
        scenario: 'Type G',
        trialLocation: 'Seattle, Washington',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Notice of Trial on 04-10-2025 at Seattle, Washington',
      );
    });

    it('should generate a title with "in standalone remote session" instead of "at [Place]" for Standalone Remote trial locations', () => {
      const extDoc = CourtIssuedDocumentFactory({
        attachments: false,
        date: '2025-04-10T04:00:00.000Z',
        documentTitle: 'Notice of Trial on [Date] at [Place]',
        documentType: 'Notice of Trial',
        scenario: 'Type G',
        trialLocation: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Notice of Trial on 04-10-2025 in standalone remote session',
      );
    });
  });
});
