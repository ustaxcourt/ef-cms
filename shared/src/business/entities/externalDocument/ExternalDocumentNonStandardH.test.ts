import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('ExternalDocumentNonStandardH', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const externalDocumentH = ExternalDocumentFactory({
        scenario: 'Nonstandard H',
      });

      expect(externalDocumentH.getFormattedValidationErrors()).toEqual({
        category: 'Select a Category.',
        documentType: 'Select a document type',
        secondaryDocument: {
          category: 'Select a Category.',
          documentType: 'Select a document type',
        },
      });
    });

    it('should be valid when all fields are present', () => {
      const externalDocumentH = ExternalDocumentFactory({
        category: 'Motion',
        documentTitle: 'Motion for Leave to File [Document Name]',
        documentType: 'Motion for Leave to File',
        scenario: 'Nonstandard H',
        secondaryDocument: {
          category: 'Application',
          documentTitle: 'Application for Waiver of Filing Fee',
          documentType: 'Application for Waiver of Filing Fee',
        },
      });

      expect(externalDocumentH.getFormattedValidationErrors()).toEqual(null);
    });

    it('should have error messages for nonstandard secondary document', () => {
      const externalDocumentH = ExternalDocumentFactory({
        category: 'Motion',
        documentTitle: 'Motion for Leave to File [Document Name]',
        documentType: 'Motion for Leave to File',
        scenario: 'Nonstandard H',
        secondaryDocument: {
          scenario: 'Nonstandard A',
        },
      });

      expect(() => externalDocumentH.validate()).toThrow();
      expect(externalDocumentH.getFormattedValidationErrors()).toEqual({
        secondaryDocument: {
          category: 'Select a Category.',
          documentType: 'Select a document type',
          previousDocument: 'Select a document',
        },
      });
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const externalDocumentH = ExternalDocumentFactory({
        category: 'Motion',
        documentTitle: getTextByCount(3001),
        documentType: 'Motion for Leave to File',
        scenario: 'Nonstandard H',
        secondaryDocument: {
          category: 'Application',
          documentTitle: 'Application for Waiver of Filing Fee',
          documentType: 'Application for Waiver of Filing Fee',
        },
      });

      expect(externalDocumentH.getFormattedValidationErrors()).toEqual({
        documentTitle:
          'Document title must be 3000 characters or fewer. Update this document title and try again.',
      });
    });
  });

  it('should be valid when all nonstandard secondary document fields are present', () => {
    const externalDocumentH = ExternalDocumentFactory({
      category: 'Motion',
      documentTitle: 'Motion for Leave to File [Document Name]',
      documentType: 'Motion for Leave to File',
      scenario: 'Nonstandard H',
      secondaryDocument: {
        category: 'Supporting Document',
        documentTitle: 'Brief in Support of [Document Name]',
        documentType: 'Brief in Support',
        previousDocument: { documentType: 'Petition' },
        scenario: 'Nonstandard A',
      },
    });

    expect(() => externalDocumentH.validate()).not.toThrow();
    expect(externalDocumentH.getFormattedValidationErrors()).toEqual(null);
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const externalDocumentH = ExternalDocumentFactory({
        category: 'Motion',
        documentTitle: 'Motion for Leave to File [Document Name]',
        documentType: 'Motion for Leave to File',
        scenario: 'Nonstandard H',
        secondaryDocument: {
          category: 'Supporting Document',
          documentTitle: 'Brief in Support of [Document Name]',
          documentType: 'Brief in Support',
          previousDocument: { documentType: 'Petition' },
          scenario: 'Nonstandard A',
        },
      });

      expect(externalDocumentH.getDocumentTitle()).toEqual(
        'Motion for Leave to File Brief in Support of Petition',
      );
    });
  });
});
