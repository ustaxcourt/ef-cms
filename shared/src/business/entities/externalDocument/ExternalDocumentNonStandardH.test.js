const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentNonStandardH', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Nonstandard H',
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
        documentType: 'Motion for Leave to File [Document Name]',
        scenario: 'Nonstandard H',
        secondaryDocument: {
          category: 'Application',
          documentType: 'Application for Waiver of Filing Fee',
        },
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    it('should have error messages for nonstandard secondary document', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Motion',
        documentType: 'Motion for Leave to File [Document Name]',
        scenario: 'Nonstandard H',
        secondaryDocument: {
          scenario: 'Nonstandard A',
        },
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        secondaryDocument: {
          category: 'You must select a category.',
          documentName: 'You must select a document.',
          documentType: 'You must select a document type.',
        },
      });
    });
  });

  it('should be valid when all nonstandard secondary document fields are present', () => {
    const extDoc = ExternalDocumentFactory.get({
      category: 'Motion',
      documentType: 'Motion for Leave to File [Document Name]',
      scenario: 'Nonstandard H',
      secondaryDocument: {
        category: 'Supporting Document',
        documentName: 'Petition',
        documentType: 'Brief in Support of [Document Name]',
        scenario: 'Nonstandard A',
      },
    });
    expect(extDoc.getFormattedValidationErrors()).toEqual(null);
  });
});
