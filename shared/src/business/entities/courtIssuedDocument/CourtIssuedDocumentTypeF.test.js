const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

describe('CourtIssuedDocumentTypeF', () => {
  describe('constructor', () => {
    it('should set attachments to false when no value is provided', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
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
      const documentInstance = CourtIssuedDocumentFactory.get({
        scenario: 'Type F',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
        judge: VALIDATION_ERROR_MESSAGES.judge,
        trialLocation: VALIDATION_ERROR_MESSAGES.trialLocation,
      });
    });

    it('should be valid when all fields are present', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: 'Order that case is assigned to [Judge Name] [Anything]',
        documentType: 'Order that case is assigned',
        judge: 'Judge Colvin',
        scenario: 'Type F',
        trialLocation: 'Seattle, Washington',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: 'Further Trial before [Judge] at [Place]',
        documentType: 'FTRL - Further Trial before ...',
        judge: 'Colvin',
        judgeWithTitle: 'Judge Colvin',
        scenario: 'Type F',
        trialLocation: 'Seattle, Washington',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Further Trial before Judge Colvin at Seattle, Washington',
      );
    });

    it('should generate a title without the judge title if not available', () => {
      const extDoc = CourtIssuedDocumentFactory.get({
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
  });
});
