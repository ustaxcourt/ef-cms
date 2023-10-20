import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('ExternalDocumentNonStandardB', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const externalDocumentB = ExternalDocumentFactory({
        scenario: 'Nonstandard B',
      });
      const customMessages = extractCustomMessages(
        externalDocumentB.getValidationRules(),
      );
      expect(externalDocumentB.getFormattedValidationErrors()).toEqual({
        category: customMessages.category[0],
        documentType: customMessages.documentType[0],
        freeText: customMessages.freeText[0],
      });
    });

    it('should be valid when all fields are present', () => {
      const externalDocumentB = ExternalDocumentFactory({
        category: 'Application',
        documentTitle: 'Application to Take Deposition of [Name]',
        documentType: 'Application to Take Deposition',
        freeText: 'Petition',
        scenario: 'Nonstandard B',
      });

      expect(externalDocumentB.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const externalDocumentB = ExternalDocumentFactory({
        category: 'Application',
        documentTitle: getTextByCount(3001),
        documentType: 'Application to Take Deposition',
        freeText: 'Petition',
        scenario: 'Nonstandard B',
      });
      const customMessages = extractCustomMessages(
        externalDocumentB.getValidationRules(),
      );
      expect(externalDocumentB.getFormattedValidationErrors()).toEqual({
        documentTitle: customMessages.documentTitle[0],
      });
    });
  });

  it('should not validate when freeText is over 1000 characters', () => {
    const externalDocumentB = ExternalDocumentFactory({
      category: 'Application',
      documentTitle: 'Application to Take Deposition of [Name]',
      documentType: 'Application to Take Deposition',
      freeText: getTextByCount(1001),
      scenario: 'Nonstandard B',
    });
    const customMessages = extractCustomMessages(
      externalDocumentB.getValidationRules(),
    );
    expect(externalDocumentB.getFormattedValidationErrors()).toEqual({
      freeText: customMessages.freeText[1],
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const externalDocumentB = ExternalDocumentFactory({
        category: 'Application',
        documentTitle: 'Application to Take Deposition of [Name]',
        documentType: 'Application to Take Deposition',
        freeText: 'Petition',
        scenario: 'Nonstandard B',
      });

      expect(externalDocumentB.getDocumentTitle()).toEqual(
        'Application to Take Deposition of Petition',
      );
    });
  });
});
