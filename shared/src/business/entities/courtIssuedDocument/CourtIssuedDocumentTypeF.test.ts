import { CourtIssuedDocumentFactory } from './CourtIssuedDocumentFactory';
import { TRIAL_SESSION_SCOPE_TYPES } from '../EntityConstants';

describe('CourtIssuedDocumentTypeF', () => {
  describe('constructor', () => {
    it('should set attachments to false when no value is provided', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        documentTitle: 'Order that case is assigned to [Judge Name] [Anything]',
        documentType: 'Order that case is assigned',
        judge: 'Judge Colvin',
        scenario: 'Type F',
        trialLocation: 'Seattle, Washington',
      });
      expect(documentInstance.attachments).toBe(false);
    });
  });

  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        scenario: 'Type F',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        documentType: 'Select a document type',
        judge: 'Select a judge',
        trialLocation: 'Select a trial location',
      });
    });

    it('should show a validation error when freeText exceeds 1000 characters', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        freeText: `...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sed leo ut urna pellentesque iaculis vel mattis lectus. Fusce ultrices ante quis nibh varius, eget blandit ipsum molestie. Aenean mi sem, laoreet a condimentum non, pharetra sed tortor. 
        Morbi varius, eros eget laoreet sagittis, nulla est tincidunt nibh, ut lobortis ante sapien vitae ex. Suspendisse et congue sem. Phasellus nec molestie tellus, sed consectetur justo. Proin eu sem suscipit, ullamcorper ante in, placerat arcu. Fusce suscipit auctor quam ac auctor. Mauris vel mi lobortis, 
        sollicitudin ante sit amet, finibus augue. Proin pellentesque sem eget ultricies gravida. 
        Donec leo lacus, commodo ut rutrum vitae, luctus ut elit. Praesent pretium pellentesque tellus et finibus.
        Quisque molestie urna a consectetur cursus. Nullam tincidunt vel ex ac mattis. Curabitur vitae efficitur dui. Aenean sed quam at sapien lacinia consectetur sit amet vitae lorem. Quisque libero nisi, luctus non tortor quis, ornare feugiat massa integer.`,
        scenario: 'Type F',
      });

      expect(documentInstance.getFormattedValidationErrors()!.freeText).toEqual(
        'Limit is 1000 characters. Enter 1000 or fewer characters.',
      );
    });

    it('should be valid when all fields are present', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        attachments: false,
        documentTitle: 'Order that case is assigned to [Judge Name] [Anything]',
        documentType: 'Order that case is assigned',
        freeText: 'some free text',
        judge: 'Judge Colvin',
        scenario: 'Type F',
        trialLocation: 'Seattle, Washington',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });

    describe('requiring filing dates on unservable documents', () => {
      it('should be invalid when filingDate is undefined on an unservable document', () => {
        const documentInstance = CourtIssuedDocumentFactory({
          attachments: false,
          documentTitle: '[Anything]',
          documentType: 'USCA',
          eventCode: 'USCA',
          judge: 'Judge Colvin',
          scenario: 'Type F',
          trialLocation: 'Seattle, Washington',
        });
        expect(
          documentInstance.getFormattedValidationErrors()!.filingDate,
        ).toBeDefined();
      });

      it('should be valid when filingDate is defined on an unservable document', () => {
        const documentInstance = CourtIssuedDocumentFactory({
          attachments: false,
          documentTitle: '[Anything]',
          documentType: 'USCA',
          eventCode: 'USCA',
          filingDate: '1990-01-01T05:00:00.000Z',
          judge: 'Judge Colvin',
          scenario: 'Type F',
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
        documentTitle: 'Further Trial before [Judge] at [Place]. [Anything]',
        documentType: 'FTRL - Further Trial before ...',
        freeText: 'some free text',
        judge: 'Colvin',
        judgeWithTitle: 'Judge Colvin',
        scenario: 'Type F',
        trialLocation: 'Seattle, Washington',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Further Trial before Judge Colvin at Seattle, Washington. some free text',
      );
    });

    it('should generate a title without the judge title if not available', () => {
      const extDoc = CourtIssuedDocumentFactory({
        attachments: false,
        documentTitle: 'Further Trial before [Judge] at [Place]',
        documentType: 'FTRL - Further Trial before ...',
        judge: 'Colvin',
        scenario: 'Type F',
        trialLocation: 'Seattle, Washington',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Further Trial before Colvin at Seattle, Washington',
      );
    });

    it('should generate a title with "in standalone remote session" instead of "at [Place]" for Standalone Remote trial locations', () => {
      const extDoc = CourtIssuedDocumentFactory({
        attachments: false,
        documentTitle: 'Further Trial before [Judge] at [Place]',
        documentType: 'FTRL - Further Trial before ...',
        judge: 'Colvin',
        scenario: 'Type F',
        trialLocation: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Further Trial before Colvin in standalone remote session',
      );
    });
  });
});
