const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

// TODO
const example = {
  category: 'Miscellaneous',
  documentTitle: '[First, Second, etc.] Amendment to [anything]',
  documentType: 'Amendment [anything]',
  eventCode: 'ADMT',
  labelFreeText: 'What is This Amendment For?',
  labelPreviousDocument: '',
  ordinalField: '',
  scenario: 'Nonstandard I',
};

describe('ExternalDocumentNonStandardI', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard I',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: 'You must select a category.',
        documentType: 'You must select a document type.',
        secondaryDocument: {
          category: 'You must select a category.',
          documentType: 'You must select a document type.',
        },
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Motion',
        documentTitle: 'Motion for Leave to File [Document Name]',
        documentType: 'Motion for Leave to File',
        scenario: 'Nonstandard I',
        secondaryDocument: {
          category: 'Application',
          documentTitle: 'Application for Waiver of Filing Fee',
          documentType: 'Application for Waiver of Filing Fee',
        },
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should have error messages for nonstandard secondary document', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Motion',
        documentTitle: 'Motion for Leave to File [Document Name]',
        documentType: 'Motion for Leave to File',
        scenario: 'Nonstandard I',
        secondaryDocument: {
          scenario: 'Nonstandard A',
        },
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        secondaryDocument: {
          category: 'You must select a category.',
          documentType: 'You must select a document type.',
          previousDocument: 'You must select a document.',
        },
      });
    });
  });

  it('should be valid when all nonstandard secondary document fields are present', () => {
    const extDoc = ExternalDocumentFactory.get({
      category: 'Motion',
      documentTitle: 'Motion for Leave to File [Document Name]',
      documentType: 'Motion for Leave to File',
      scenario: 'Nonstandard I',
      secondaryDocument: {
        category: 'Supporting Document',
        documentTitle: 'Brief in Support of [Document Name]',
        documentType: 'Brief in Support',
        previousDocument: 'Petition',
        scenario: 'Nonstandard A',
      },
    });
    expect(extDoc.getFormattedValidationErrors()).toEqual(null);
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Motion',
        documentTitle: 'Motion for Leave to File [Document Name]',
        documentType: 'Motion for Leave to File',
        scenario: 'Nonstandard I',
        secondaryDocument: {
          category: 'Supporting Document',
          documentTitle: 'Brief in Support of [Document Name]',
          documentType: 'Brief in Suppport',
          previousDocument: 'Petition',
          scenario: 'Nonstandard A',
        },
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Motion for Leave to File Brief in Support of Petition',
      );
    });
  });
});
