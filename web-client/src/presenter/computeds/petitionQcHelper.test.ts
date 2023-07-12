import { applicationContext } from '../../applicationContext';
import {
  initialFilingDocumentTabs,
  petitionQcHelper as petitionQcHelperComputed,
} from './petitionQcHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('petitionQcHelper', () => {
  const petitionQcHelper = withAppContextDecorator(
    petitionQcHelperComputed,
    applicationContext,
  );
  let mockState;

  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();

  describe('isPetitionFile', () => {
    it('should be false when the documentSelectedForPreview is NOT a petition file', () => {
      mockState = {
        caseDetail: {
          docketEntries: [],
        },
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
        caseDetail: {
          docketEntries: [],
        },
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
        caseDetail: {
          docketEntries: [],
        },
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
        caseDetail: {
          docketEntries: [
            {
              eventCode: INITIAL_DOCUMENT_TYPES.corporateDisclosure.eventCode,
            },
          ],
        },
        currentViewMetadata: {
          documentSelectedForPreview: 'petitionFile',
        },
        form: {
          isPaper: false,
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
        initialFilingDocumentTabs[3], // CDS
      ]);
    });

    it('hides CDS tab for electronic filings if one was NOT initially filed', () => {
      mockState = {
        caseDetail: {
          docketEntries: [],
        },
        currentViewMetadata: {
          documentSelectedForPreview: 'petitionFile',
        },
        form: {
          isPaper: false,
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

  describe('showRemovePdfButton', () => {
    it('returns showRemovePdfButton true if the case is a paper filing', () => {
      mockState = {
        caseDetail: {
          docketEntries: [],
        },
        currentViewMetadata: {
          documentSelectedForPreview: 'petitionFile',
        },
        form: {
          isPaper: true,
        },
      };

      const { showRemovePdfButton } = runCompute(petitionQcHelper, {
        state: {
          ...mockState,
          pdfForSigning: {
            signatureData: null,
          },
        },
      });
      expect(showRemovePdfButton).toEqual(true);
    });

    it('returns showRemovePdfButton false if the case is an electronic filing', () => {
      mockState = {
        caseDetail: {
          docketEntries: [],
        },
        currentViewMetadata: {
          documentSelectedForPreview: 'petitionFile',
        },
        form: {
          isPaper: false,
        },
      };

      const { showRemovePdfButton } = runCompute(petitionQcHelper, {
        state: {
          ...mockState,
          pdfForSigning: {
            signatureData: null,
          },
        },
      });
      expect(showRemovePdfButton).toEqual(false);
    });
  });
});
