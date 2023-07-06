import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { ExternalDocumentStandard } from './ExternalDocumentStandard';
import { getTextByCount } from '../../utilities/getTextByCount';

describe('ExternalDocumentStandard', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const externalDocumentStandard = ExternalDocumentFactory({
        scenario: 'Standard',
      });

      expect(externalDocumentStandard.getFormattedValidationErrors()).toEqual({
        category: ExternalDocumentStandard.VALIDATION_ERROR_MESSAGES.category,
        documentType:
          ExternalDocumentStandard.VALIDATION_ERROR_MESSAGES.documentType[1],
      });
    });

    it('should be valid when all fields are present', () => {
      const externalDocumentStandard = ExternalDocumentFactory({
        category: 'Application',
        documentTitle: 'Application for Waiver of Filing Fee',
        documentType: 'Application for Waiver of Filing Fee',
        scenario: 'Standard',
      });

      expect(externalDocumentStandard.getFormattedValidationErrors()).toEqual(
        null,
      );
    });

    it('should be invalid when documentTitle is over 3000 characters', () => {
      const externalDocumentStandard = ExternalDocumentFactory({
        category: 'Application',
        documentTitle: getTextByCount(3001),
        documentType: 'Application for Waiver of Filing Fee',
        scenario: 'Standard',
      });

      expect(externalDocumentStandard.getFormattedValidationErrors()).toEqual({
        documentTitle:
          ExternalDocumentStandard.VALIDATION_ERROR_MESSAGES.documentTitle,
      });
    });

    describe('Proposed Stipulated Decision', () => {
      it('should be allowed to have "Proposed Stipulated Decision"', () => {
        const externalDocumentStandard = ExternalDocumentFactory({
          category: 'Decision',
          documentTitle: 'Proposed Stipulated Decision',
          documentType: 'Proposed Stipulated Decision',
          scenario: 'Standard',
        });

        expect(externalDocumentStandard.getFormattedValidationErrors()).toEqual(
          null,
        );
      });

      describe('Consolidated Case filing to multiple cases', () => {
        it('should not be allowed to have "Proposed Stipulated Decision"', () => {
          const externalDocumentStandard = ExternalDocumentFactory({
            category: 'Decision',
            documentTitle: 'Proposed Stipulated Decision',
            documentType: 'Proposed Stipulated Decision',
            scenario: 'Standard',
            selectedCases: ['101-19', '102-19'],
          });

          expect(
            externalDocumentStandard.getFormattedValidationErrors(),
          ).toEqual({
            documentType:
              'Proposed Stipulated Decision must be filed separately in each case',
          });
        });
      });
    });
  });

  describe('title generation', () => {
    it('should generate valid title', () => {
      const externalDocumentStandard = ExternalDocumentFactory({
        category: 'Application',
        documentTitle: 'Application for Waiver of Filing Fee',
        documentType: 'Application for Waiver of Filing Fee',
        scenario: 'Standard',
      });

      expect(externalDocumentStandard.getDocumentTitle()).toEqual(
        'Application for Waiver of Filing Fee',
      );
    });
  });
});
