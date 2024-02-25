import { applicationContext } from '../../applicationContext';
import { petitionQcHelper as petitionQcHelperComputed } from './petitionQcHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('petitionQcHelper', () => {
  const petitionQcHelper = withAppContextDecorator(
    petitionQcHelperComputed,
    applicationContext,
  );
  let mockState;

  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();
  const initialTabs = Object.values(INITIAL_DOCUMENT_TYPES)
    .sort((a, b) => a.sort - b.sort)
    .map(tab => tab.tabTitle);

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
        state: mockState,
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
        state: mockState,
      });
      expect(documentTabsToDisplay.map(tab => tab.tabTitle)).toEqual(
        initialTabs,
      );
    });

    it('hides APW and RQT tabs for electronic filings', () => {
      mockState = {
        caseDetail: {
          docketEntries: [
            {
              eventCode: INITIAL_DOCUMENT_TYPES.corporateDisclosure.eventCode,
            },
            {
              eventCode: INITIAL_DOCUMENT_TYPES.attachmentToPetition.eventCode,
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
        state: mockState,
      });
      expect(documentTabsToDisplay.map(tab => tab.tabTitle)).toEqual([
        initialTabs[0], // Petition
        initialTabs[1], // STIN
        initialTabs[2], // ATP
        initialTabs[4], // CDS
      ]);
    });

    it('displays ATP tab for electronic filings when an ATP is uploaded', () => {
      mockState = {
        caseDetail: {
          docketEntries: [
            {
              eventCode: INITIAL_DOCUMENT_TYPES.attachmentToPetition.eventCode,
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
        state: mockState,
      });
      expect(documentTabsToDisplay.map(tab => tab.tabTitle)).toEqual([
        initialTabs[0], // Petition
        initialTabs[1], // STIN
        initialTabs[2], // ATP
      ]);
    });

    it('displays CDS tab for electronic filings when a CDS is uploaded', () => {
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
        state: mockState,
      });

      expect(documentTabsToDisplay.map(tab => tab.tabTitle)).toEqual([
        initialTabs[0], // Petition
        initialTabs[1], // STIN
        initialTabs[4], // CDS
      ]);
    });

    it('hides CDS and ATP tabs for electronic filings if none of the docs were initially filed', () => {
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
        state: mockState,
      });
      expect(documentTabsToDisplay.map(tab => tab.tabTitle)).toEqual([
        initialTabs[0], // Petition
        initialTabs[1], // STIN
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
        state: mockState,
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
        state: mockState,
      });
      expect(showRemovePdfButton).toEqual(false);
    });
  });
});
