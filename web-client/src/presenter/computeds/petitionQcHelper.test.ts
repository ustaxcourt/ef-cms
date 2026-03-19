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

    it('displays ATP tab for electronic filings if an ATP document is filed', () => {
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

    it('displays CDS tab for electronic filings if a CDS document is filed', () => {
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

  describe('selectedTabHasAttachment', () => {
    const { INITIAL_DOCUMENT_TYPES, INITIAL_DOCUMENT_TYPES_MAP } =
      applicationContext.getConstants();

    it('should return false when documentSelectedForPreview is undefined', () => {
      mockState = {
        caseDetail: {
          docketEntries: [],
        },
        currentViewMetadata: {
          documentSelectedForPreview: undefined,
        },
        form: {
          isPaper: true,
        },
      };

      const { selectedTabHasAttachment } = runCompute(petitionQcHelper, {
        state: mockState,
      });
      expect(selectedTabHasAttachment).toBe(false);
    });

    it('should return false when documentSelectedForPreview is null', () => {
      mockState = {
        caseDetail: {
          docketEntries: [],
        },
        currentViewMetadata: {
          documentSelectedForPreview: null,
        },
        form: {
          isPaper: true,
        },
      };

      const { selectedTabHasAttachment } = runCompute(petitionQcHelper, {
        state: mockState,
      });
      expect(selectedTabHasAttachment).toBe(false);
    });

    it('should return true when documentSelectedForPreview is a form key and form has the file', () => {
      mockState = {
        caseDetail: {
          docketEntries: [],
        },
        currentViewMetadata: {
          documentSelectedForPreview: 'stinFile',
        },
        form: {
          isPaper: true,
          stinFile: { name: 'test-stin.pdf' },
        },
      };

      const { selectedTabHasAttachment } = runCompute(petitionQcHelper, {
        state: mockState,
      });
      expect(selectedTabHasAttachment).toBe(true);
    });

    it('should return false when documentSelectedForPreview is a form key but form does not have the file', () => {
      mockState = {
        caseDetail: {
          docketEntries: [],
        },
        currentViewMetadata: {
          documentSelectedForPreview: 'stinFile',
        },
        form: {
          isPaper: true,
        },
      };

      const { selectedTabHasAttachment } = runCompute(petitionQcHelper, {
        state: mockState,
      });
      expect(selectedTabHasAttachment).toBe(false);
    });

    it('should return true when documentSelectedForPreview is a documentType string and form has the corresponding file', () => {
      mockState = {
        caseDetail: {
          docketEntries: [],
        },
        currentViewMetadata: {
          documentSelectedForPreview:
            INITIAL_DOCUMENT_TYPES.stin.documentType,
        },
        form: {
          isPaper: true,
          stinFile: { name: 'test-stin.pdf' },
        },
      };

      const { selectedTabHasAttachment } = runCompute(petitionQcHelper, {
        state: mockState,
      });
      expect(selectedTabHasAttachment).toBe(true);
    });

    it('should return true when documentSelectedForPreview is a UUID matching a docketEntryId', () => {
      const testDocketEntryId = '123e4567-e89b-12d3-a456-426614174000';
      mockState = {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: testDocketEntryId,
              documentType: 'Petition',
            },
          ],
        },
        currentViewMetadata: {
          documentSelectedForPreview: testDocketEntryId,
        },
        form: {
          isPaper: true,
        },
      };

      const { selectedTabHasAttachment } = runCompute(petitionQcHelper, {
        state: mockState,
      });
      expect(selectedTabHasAttachment).toBe(true);
    });

    it('should return false when documentSelectedForPreview is a UUID but no matching docketEntryId exists', () => {
      const testDocketEntryId = '123e4567-e89b-12d3-a456-426614174000';
      mockState = {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: '999e4567-e89b-12d3-a456-426614174000',
              documentType: 'Petition',
            },
          ],
        },
        currentViewMetadata: {
          documentSelectedForPreview: testDocketEntryId,
        },
        form: {
          isPaper: true,
        },
      };

      const { selectedTabHasAttachment } = runCompute(petitionQcHelper, {
        state: mockState,
      });
      expect(selectedTabHasAttachment).toBe(false);
    });

    it('should return true when documentSelectedForPreview is a form key and docketEntry exists with matching documentType', () => {
      mockState = {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: '123e4567-e89b-12d3-a456-426614174000',
              documentType: INITIAL_DOCUMENT_TYPES_MAP.stinFile,
            },
          ],
        },
        currentViewMetadata: {
          documentSelectedForPreview: 'stinFile',
        },
        form: {
          isPaper: true,
        },
      };

      const { selectedTabHasAttachment } = runCompute(petitionQcHelper, {
        state: mockState,
      });
      expect(selectedTabHasAttachment).toBe(true);
    });

    it('should return true when documentSelectedForPreview is a documentType string and docketEntry exists with matching documentType', () => {
      mockState = {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: '123e4567-e89b-12d3-a456-426614174000',
              documentType: INITIAL_DOCUMENT_TYPES.stin.documentType,
            },
          ],
        },
        currentViewMetadata: {
          documentSelectedForPreview:
            INITIAL_DOCUMENT_TYPES.stin.documentType,
        },
        form: {
          isPaper: true,
        },
      };

      const { selectedTabHasAttachment } = runCompute(petitionQcHelper, {
        state: mockState,
      });
      expect(selectedTabHasAttachment).toBe(true);
    });

    it('should return false when documentSelectedForPreview is a documentType string but no matching docketEntry exists', () => {
      mockState = {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: '123e4567-e89b-12d3-a456-426614174000',
              documentType: 'Petition',
            },
          ],
        },
        currentViewMetadata: {
          documentSelectedForPreview:
            INITIAL_DOCUMENT_TYPES.stin.documentType,
        },
        form: {
          isPaper: true,
        },
      };

      const { selectedTabHasAttachment } = runCompute(petitionQcHelper, {
        state: mockState,
      });
      expect(selectedTabHasAttachment).toBe(false);
    });

    it('should return true when multiple conditions are met (form has file AND docketEntry exists)', () => {
      const testDocketEntryId = '123e4567-e89b-12d3-a456-426614174000';
      mockState = {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: testDocketEntryId,
              documentType: INITIAL_DOCUMENT_TYPES_MAP.stinFile,
            },
          ],
        },
        currentViewMetadata: {
          documentSelectedForPreview: 'stinFile',
        },
        form: {
          isPaper: true,
          stinFile: { name: 'test-stin.pdf' },
        },
      };

      const { selectedTabHasAttachment } = runCompute(petitionQcHelper, {
        state: mockState,
      });
      expect(selectedTabHasAttachment).toBe(true);
    });

    it('should return false when none of the conditions are met', () => {
      mockState = {
        caseDetail: {
          docketEntries: [
            {
              docketEntryId: '999e4567-e89b-12d3-a456-426614174000',
              documentType: 'Petition',
            },
          ],
        },
        currentViewMetadata: {
          documentSelectedForPreview:
            INITIAL_DOCUMENT_TYPES.stin.documentType,
        },
        form: {
          isPaper: true,
        },
      };

      const { selectedTabHasAttachment } = runCompute(petitionQcHelper, {
        state: mockState,
      });
      expect(selectedTabHasAttachment).toBe(false);
    });
  });
});
