import { applicationContext } from '../../applicationContext';
import {
  initialFilingDocumentTabs,
  petitionQcHelper as petitionQcHelperComputed,
} from './petitionQcHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('petitionQcHelper', () => {
  const petitionQcHelper = withAppContextDecorator(
    petitionQcHelperComputed,
    applicationContext,
  );
  let mockState;

  describe('isPetitionFile', () => {
    it('should be false when the documentSelectedForPreview is NOT a petition file', () => {
      mockState = {
        currentViewMetadata: {
          documentSelectedForPreview: 'requestForPlaceOfTrialFile',
        },
        form: {
          isPaper: true,
        },
      };

      const { isPetitionFile } = runCompute(petitionQcHelper, {
        state: mockState,
      });
      expect(isPetitionFile).toBe(false);
    });

    it('should be true when the documentSelectedForPreview is a petition file', () => {
      mockState = {
        currentViewMetadata: {
          documentSelectedForPreview: 'petitionFile',
        },
        form: {
          isPaper: true,
        },
      };

      const { isPetitionFile } = runCompute(petitionQcHelper, {
        state: {
          ...mockState,
          pdfForSigning: {
            signatureData: null,
          },
        },
      });
      expect(isPetitionFile).toBe(true);
    });
  });

  describe('documentTabsToDisplay', () => {
    it('returns all initial filing document tabs for paper filings', () => {
      mockState = {
        currentViewMetadata: {
          documentSelectedForPreview: 'petitionFile',
        },
        form: {
          isPaper: true,
        },
      };

      const { documentTabsToDisplay } = runCompute(petitionQcHelper, {
        state: {
          ...mockState,
          pdfForSigning: {
            signatureData: null,
          },
        },
      });
      expect(documentTabsToDisplay).toEqual(initialFilingDocumentTabs);
    });

    it('hides APW and RQT tabs for electronic filings', () => {
      mockState = {
        currentViewMetadata: {
          documentSelectedForPreview: 'petitionFile',
        },
        form: {
          isPaper: false,
          ownershipDisclosureFile: {},
        },
      };

      const { documentTabsToDisplay } = runCompute(petitionQcHelper, {
        state: {
          ...mockState,
          pdfForSigning: {
            signatureData: null,
          },
        },
      });
      expect(documentTabsToDisplay).toEqual([
        initialFilingDocumentTabs[0], // Petition
        initialFilingDocumentTabs[1], // STIN
        initialFilingDocumentTabs[3], // ODS
      ]);
    });

    it('hides ODS tab for electronic filings if one was NOT initially filed', () => {
      mockState = {
        currentViewMetadata: {
          documentSelectedForPreview: 'petitionFile',
        },
        form: {
          isPaper: false,
          ownershipDisclosureFile: undefined,
        },
      };

      const { documentTabsToDisplay } = runCompute(petitionQcHelper, {
        state: {
          ...mockState,
          pdfForSigning: {
            signatureData: null,
          },
        },
      });
      expect(documentTabsToDisplay).toEqual([
        initialFilingDocumentTabs[0], // Petition
        initialFilingDocumentTabs[1], // STIN
      ]);
    });
  });
});
