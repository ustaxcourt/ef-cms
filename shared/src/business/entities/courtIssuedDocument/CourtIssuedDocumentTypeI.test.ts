import { CourtIssuedDocumentFactory } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentFactory';
import { CourtIssuedDocumentTypeI } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentTypeI';

describe('CourtIssuedDocumentTypeI', () => {
  const validProps = {
    attachments: false,
    documentTitle: 'Notice of Assignment of Trial Judge to [Judge Name]',
    documentType: 'Notice of Assignment of Trial Judge',
    eventCode: 'NATJ',
    judge: 'Buch',
    judgeWithTitle: 'Judge Buch',
    scenario: 'Type I',
  };

  describe('constructor', () => {
    it('should be created by the factory for the Type I scenario', () => {
      const documentInstance = CourtIssuedDocumentFactory(validProps);

      expect(documentInstance).toBeInstanceOf(CourtIssuedDocumentTypeI);
    });

    it('should set attachments to false when no value is provided', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        ...validProps,
        attachments: undefined,
      });

      expect(documentInstance.attachments).toBe(false);
    });

    it('should not retain freeText, since Type I has no description field', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        ...validProps,
        freeText: 'Some free text',
      });

      expect(documentInstance).not.toHaveProperty('freeText');
    });
  });

  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        scenario: 'Type I',
      });

      expect(documentInstance.getFormattedValidationErrors()).toEqual({
        documentType: 'Select a document type',
        judge: 'Select a judge',
      });
    });

    it('should be valid when all fields are present', () => {
      const documentInstance = CourtIssuedDocumentFactory(validProps);

      expect(documentInstance.getFormattedValidationErrors()).toEqual(null);
    });
  });

  describe('title generation', () => {
    it('should generate a title with the judge title when available', () => {
      const documentInstance = CourtIssuedDocumentFactory(validProps);

      expect(documentInstance.getDocumentTitle()).toEqual(
        'Notice of Assignment of Trial Judge to Judge Buch',
      );
    });

    it('should generate a title with the judge name when the judge title is not available', () => {
      const documentInstance = CourtIssuedDocumentFactory({
        ...validProps,
        judgeWithTitle: undefined,
      });

      expect(documentInstance.getDocumentTitle()).toEqual(
        'Notice of Assignment of Trial Judge to Buch',
      );
    });
  });
});
