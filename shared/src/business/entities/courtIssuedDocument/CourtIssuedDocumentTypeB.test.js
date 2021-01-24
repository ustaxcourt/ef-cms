const {
  over1000Characters,
} = require('../../test/createTestApplicationContext');
const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

describe('CourtIssuedDocumentTypeB', () => {
  describe('constructor', () => {
    it('should set attachments to false when no value is provided', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        documentTitle: 'Order that case is assigned to [Judge Name] [Anything]',
        documentType: 'Order that case is assigned',
        freeText: 'Some free text',
        judge: 'Judge Colvin',
        scenario: 'Type B',
      });
      expect(documentInstance.attachments).toBe(false);
    });
  });

  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        scenario: 'Type B',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
        judge: VALIDATION_ERROR_MESSAGES.judge,
      });
    });

    it('should be valid when all fields are present', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: 'Order that case is assigned to [Judge Name] [Anything]',
        documentType: 'Order that case is assigned',
        freeText: 'Some free text',
        judge: 'Judge Colvin',
        scenario: 'Type B',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when freeText is longer than 1000 characters', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: 'Order that case is assigned to [Judge Name] [Anything]',
        documentType: 'Order that case is assigned',
        freeText: over1000Characters,
        judge: 'Judge Colvin',
        scenario: 'Type B',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        freeText: VALIDATION_ERROR_MESSAGES.freeText[1].message,
      });
    });

    describe('requiring filing dates on unservable documents', () => {
      it('should be invalid when filingDate is undefined on an unservable document', () => {
        const documentInstance = CourtIssuedDocumentFactory.get({
          attachments: false,
          documentTitle: '[Anything]',
          documentType: 'USCA',
          eventCode: 'USCA',
          judge: 'Judge Colvin',
          scenario: 'Type B',
        });
        expect(
          documentInstance.getFormattedValidationErrors().filingDate,
        ).toBeDefined();
      });

      it('should be valid when filingDate is defined on an unservable document', () => {
        const documentInstance = CourtIssuedDocumentFactory.get({
          attachments: false,
          documentTitle: '[Anything]',
          documentType: 'USCA',
          eventCode: 'USCA',
          filingDate: '1990-01-01T05:00:00.000Z',
          judge: 'Judge Colvin',
          scenario: 'Type B',
        });
        expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: 'Order that case is assigned to [Judge Name] [Anything]',
        documentType: 'Order that case is assigned',
        freeText: 'Some free text',
        judge: 'Colvin',
        judgeWithTitle: 'Judge Colvin',
        scenario: 'Type B',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Order that case is assigned to Judge Colvin Some free text',
      );
    });

    it('should generate a title without the judge title if not available', () => {
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: 'Order that case is assigned to [Judge Name] [Anything]',
        documentType: 'Order that case is assigned',
        freeText: 'Some free text',
        judge: 'Colvin',
        scenario: 'Type B',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Order that case is assigned to Colvin Some free text',
      );
    });

    it('should generate valid title without optional freeText', () => {
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: 'Order that case is assigned to [Judge Name] [Anything]',
        documentType: 'Order that case is assigned',
        judge: 'Judge Colvin',
        scenario: 'Type B',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Order that case is assigned to Judge Colvin',
      );
    });
  });
});
