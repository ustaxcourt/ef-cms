import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('ExternalDocumentNonStandardC', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const externalDocumentC = ExternalDocumentFactory({
        scenario: 'Nonstandard C',
      });

      expect(externalDocumentC.getFormattedValidationErrors()).toEqual({
        category: externalDocumentC.getErrorToMessageMap().category,
        documentType: externalDocumentC.getErrorToMessageMap().documentType[1],
        freeText: externalDocumentC.getErrorToMessageMap().freeText[0].message,
        previousDocument:
          externalDocumentC.getErrorToMessageMap().previousDocument,
      });
    });

    it('should be valid when all fields are present', () => {
      const externalDocumentC = ExternalDocumentFactory({
        category: 'Supporting Document',
        documentTitle: 'Affidavit Of [Name] in Support Of [Document Name]',
        documentType: 'Affidavit in Support',
        freeText: 'Lori Loughlin',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard C',
      });

      expect(externalDocumentC.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be invalid when freeText is over 1000 characters', () => {
      const externalDocumentC = ExternalDocumentFactory({
        category: 'Supporting Document',
        documentTitle: 'Affidavit Of [Name] in Support Of [Document Name]',
        documentType: 'Affidavit in Support',
        freeText: getTextByCount(1001),
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard C',
      });

      expect(externalDocumentC.getFormattedValidationErrors()).toEqual({
        freeText: externalDocumentC.getErrorToMessageMap().freeText[1].message,
      });
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const externalDocumentC = ExternalDocumentFactory({
        category: 'Supporting Document',
        documentTitle: getTextByCount(3001),
        documentType: 'Affidavit in Support',
        freeText: 'what',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard C',
      });

      expect(externalDocumentC.getFormattedValidationErrors()).toEqual({
        documentTitle: externalDocumentC.getErrorToMessageMap().documentTitle,
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title with previousDocument documentType', () => {
      const externalDocumentC = ExternalDocumentFactory({
        category: 'Supporting Document',
        documentTitle: 'Affidavit Of [Name] in Support Of [Document Name]',
        documentType: 'Affidavit in Support',
        freeText: 'Lori Loughlin',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard C',
      });

      expect(externalDocumentC.getDocumentTitle()).toEqual(
        'Affidavit Of Lori Loughlin in Support Of Petition',
      );
    });

    it('should generate valid title with previousDocument documentTitle', () => {
      const externalDocumentC = ExternalDocumentFactory({
        category: 'Supporting Document',
        documentTitle: 'Affidavit Of [Name] in Support Of [Document Name]',
        documentType: 'Affidavit in Support',
        freeText: 'Lori Loughlin',
        previousDocument: {
          documentTitle: 'Stipulation Something',
          documentType: 'Stipulation',
        },
        scenario: 'Nonstandard C',
      });

      expect(externalDocumentC.getDocumentTitle()).toEqual(
        'Affidavit Of Lori Loughlin in Support Of Stipulation Something',
      );
    });

    it('should generate title without previousDocument', () => {
      const externalDocumentC = ExternalDocumentFactory({
        category: 'Supporting Document',
        documentTitle: 'Affidavit Of [Name] in Support Of [Document Name]',
        documentType: 'Affidavit in Support',
        freeText: 'Lori Loughlin',
        scenario: 'Nonstandard C',
      });

      expect(externalDocumentC.getDocumentTitle()).toEqual(
        'Affidavit Of Lori Loughlin in Support Of',
      );
    });
  });
});
