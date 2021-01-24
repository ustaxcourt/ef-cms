const {
  over1000Characters,
} = require('../../test/createTestApplicationContext');
const { CourtIssuedDocumentFactory } = require('./CourtIssuedDocumentFactory');
const { VALIDATION_ERROR_MESSAGES } = require('./CourtIssuedDocumentConstants');

describe('CourtIssuedDocumentTypeA', () => {
  describe('constructor', () => {
    it('should set attachments to false when no value is provided', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        documentTitle: '[Anything]',
        documentType: 'Order',
        freeText: 'Some free text',
        scenario: 'Type A',
        serviceStamp: 'Served',
      });
      expect(documentInstance.attachments).toBe(false);
    });
  });

  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        scenario: 'Type A',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        documentType: VALIDATION_ERROR_MESSAGES.documentType,
      });
    });

    it('should be valid when all fields are present', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: '[Anything]',
        documentType: 'Order',
        freeText: 'Some free text',
        scenario: 'Type A',
        serviceStamp: 'Served',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });

    describe('requiring filing dates on unservable documents', () => {
      it('should be invalid when filingDate is undefined on an unservable document', () => {
        const documentInstance = CourtIssuedDocumentFactory.get({
          attachments: false,
          documentTitle: '[Anything]',
          documentType: 'USCA',
          eventCode: 'USCA',
          scenario: 'Type A',
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
          scenario: 'Type A',
        });
        expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
      });
    });

    it('should be invalid if the document type is a generic order and serviceStamp and freeText are not present', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: '[Anything]',
        documentType: 'Order',
        scenario: 'Type A',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        freeText: VALIDATION_ERROR_MESSAGES.freeText[0].message,
        serviceStamp: VALIDATION_ERROR_MESSAGES.serviceStamp,
      });
    });

    it('should be invalid when freeText is longer than 1000 characters', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: '[Anything]',
        documentType: 'Order',
        freeText: over1000Characters,
        scenario: 'Type A',
        serviceStamp: 'Served',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        freeText: VALIDATION_ERROR_MESSAGES.freeText[1].message,
      });
    });

    it('should be invalid if the document type is a generic order and serviceStamp is present and not a valid option', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: '[Anything]',
        documentType: 'Order',
        freeText: 'Some free text',
        scenario: 'Type A',
        serviceStamp: 'Something invalid',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        serviceStamp: VALIDATION_ERROR_MESSAGES.serviceStamp,
      });
    });

    it('should be valid if the document type is a generic order and serviceStamp is present and a valid option and freeText is present', () => {
      const documentInstance = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: '[Anything]',
        documentType: 'Order',
        freeText: 'Some free text',
        scenario: 'Type A',
        serviceStamp: 'Served',
      });
      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: '[Anything]',
        documentType: 'Order',
        freeText: 'Some free text',
        scenario: 'Type A',
      });
      expect(extDoc.getDocumentTitle()).toEqual('Some free text');
    });

    it('should generate valid title without optional freeText for non-generic order type', () => {
      const extDoc = CourtIssuedDocumentFactory.get({
        attachments: false,
        documentTitle: 'Order that caption of case is amended [Anything]',
        documentType: 'Order that caption of case is amended',
        scenario: 'Type A',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Order that caption of case is amended',
      );
    });
  });
});
