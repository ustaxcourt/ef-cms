const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');
const { ExternalDocumentFactory } = require('./ExternalDocumentFactory');

describe('ExternalDocumentStandard', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const extDoc = ExternalDocumentFactory.get({
        scenario: 'Standard',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual({
        category: VALIDATION_ERROR_MESSAGES.category,
        documentType: VALIDATION_ERROR_MESSAGES.documentType[1],
      });
    });

    it('should be valid when all fields are present', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Application',
        documentTitle: 'Application for Waiver of Filing Fee',
        documentType: 'Application for Waiver of Filing Fee',
        scenario: 'Standard',
      });
      expect(extDoc.getFormattedValidationErrors()).toEqual(null);
    });

    describe('Proposed Stipulated Decision', () => {
      it('should be allowed to have "Proposed Stipulated Decision" ', () => {
        const extDoc = ExternalDocumentFactory.get({
          category: 'Decision',
          documentTitle: 'Proposed Stipulated Decision',
          documentType: 'Proposed Stipulated Decision',
          scenario: 'Standard',
        });
        expect(extDoc.getFormattedValidationErrors()).toEqual(null);
      });

      describe('Consolidated Case filing to multiple cases', () => {
        it('should not be allowed to have "Proposed Stipulated Decision" ', () => {
          const extDoc = ExternalDocumentFactory.get({
            category: 'Decision',
            documentTitle: 'Proposed Stipulated Decision',
            documentType: 'Proposed Stipulated Decision',
            scenario: 'Standard',
            selectedCases: ['101-19', '102-19'],
          });
          expect(extDoc.getFormattedValidationErrors()).toEqual({
            documentType:
              'Proposed Stipulated Decision must be filed seperatly in each case',
          });
        });
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const extDoc = ExternalDocumentFactory.get({
        category: 'Application',
        documentTitle: 'Application for Waiver of Filing Fee',
        documentType: 'Application for Waiver of Filing Fee',
        scenario: 'Standard',
      });
      expect(extDoc.getDocumentTitle()).toEqual(
        'Application for Waiver of Filing Fee',
      );
    });
  });
});
