import { docketRecordHelper } from './docketRecordHelper';
import { runCompute } from 'cerebral/test';

describe('docketRecordHelper', () => {
  describe('showEditOrSealDocketRecordEntry', () => {
    it('should be true when the user has EDIT_DOCKET_ENTRY permission', () => {
      const result = runCompute(docketRecordHelper, {
        state: {
          permissions: {
            EDIT_DOCKET_ENTRY: true,
            SEAL_DOCKET_ENTRY: false,
          },
        },
      });

      expect(result.showEditOrSealDocketRecordEntry).toBe(true);
    });

    it('should be true when the user has SEAL_DOCKET_ENTRY permission', () => {
      const result = runCompute(docketRecordHelper, {
        state: {
          permissions: {
            EDIT_DOCKET_ENTRY: false,
            SEAL_DOCKET_ENTRY: true,
          },
        },
      });

      expect(result.showEditOrSealDocketRecordEntry).toBe(true);
    });

    it('should be false when when the user does not have EDIT_DOCKET_ENTRY and SEAL_DOCKET_ENTRY permissions', () => {
      const result = runCompute(docketRecordHelper, {
        state: {
          permissions: {
            EDIT_DOCKET_ENTRY: false,
            SEAL_DOCKET_ENTRY: false,
          },
        },
      });

      expect(result.showEditOrSealDocketRecordEntry).toBe(false);
    });
  });

  describe('showPrintableDocketRecord', () => {
    it('should be set to the value of caseDetail.canAllowPrintableDocketRecord', () => {
      const mockCanAllowPrintableDocketRecord = true;

      const result = runCompute(docketRecordHelper, {
        state: {
          caseDetail: {
            canAllowPrintableDocketRecord: mockCanAllowPrintableDocketRecord,
          },
          permissions: {},
        },
      });

      expect(result.showPrintableDocketRecord).toBe(
        mockCanAllowPrintableDocketRecord,
      );
    });
  });

  describe.only('sortLabelText', () => {
    const sortLabels = {
      byDate: 'Oldest to newest',
      byDateDesc: 'Newest to oldest',
      byIndex: 'Order ascending',
      byIndexDesc: 'Order descending',
    };

    sortLabels.forEach(sortLabel => {
      it('should be "Oldest to newest" when the sortOrder is "byDate"', () => {
        const mockDocketNumber = '111-11';

        const result = runCompute(docketRecordHelper, {
          state: {
            caseDetail: {
              canAllowPrintableDocketRecord: true,
              docketNumber: mockDocketNumber,
            },
            permissions: {},
            sessionMetadata: {
              docketRecordSort: {
                mockDocketNumber: 'byDate',
              },
            },
          },
        });

        expect(result.sortLabelText).toBe(sortLabels['byDate']);
      });
    });
  });
});
