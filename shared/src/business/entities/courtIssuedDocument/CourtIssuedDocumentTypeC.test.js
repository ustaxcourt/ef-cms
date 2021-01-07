const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

describe('CourtIssuedDocumentTypeC', () => {
  describe('constructor', () => {
    it('should set attachments to false when no value is provided', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
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
      const documentInstance = CourtIssuedDocumentFactory.get({
        scenario: 'Type C',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        docketNumbers: VALIDATION_ERROR_MESSAGES.docketNumbers,
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
      });
    });

    it('should be valid when all fields are present', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        attachments: false,
        docketNumbers: '101-19',
        documentTitle:
          'Order that the letter "L" is added to Docket Number [Anything]',
        documentType: 'Order that the letter "L" is added to Docket Number',
        scenario: 'Type C',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });
    describe('requiring filing dates on unservable documents', () => {
      it('should be invalid when filingDate is undefined on an unservable document', () => {
        const documentInstance = CourtIssuedDocumentFactory.get({
          attachments: false,
          docketNumbers: '101-19',

          documentTitle: '[Anything]',
          documentType: 'USCA',
          eventCode: 'USCA',
          scenario: 'Type C',
        });
        expect(
          documentInstance.getFormattedValidationErrors().filingDate,
        ).toBeDefined();
      });

      it('should be valid when filingDate is defined on an unservable document', () => {
        const documentInstance = CourtIssuedDocumentFactory.get({
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
      const extDoc = CourtIssuedDocumentFactory.get({
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
