import { docketRecordHelper } from './docketRecordHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('docketRecordHelper', () => {
  const mockDocketNumber = '111-11';

  describe('showEditOrSealDocketRecordEntry', () => {
    it('should be true when the user has EDIT_DOCKET_ENTRY permission', () => {
      const result = runCompute(docketRecordHelper, {
        state: {
          permissions: {
            EDIT_DOCKET_ENTRY: true,
            SEAL_DOCKET_ENTRY: false,
          },
          sessionMetadata: {
            docketRecordSort: {
              [mockDocketNumber]: '',
            },
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
          sessionMetadata: {
            docketRecordSort: {
              [mockDocketNumber]: '',
            },
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
          sessionMetadata: {
            docketRecordSort: {
              [mockDocketNumber]: '',
            },
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
          sessionMetadata: {
            docketRecordSort: {
              [mockDocketNumber]: '',
            },
          },
        },
      });

      expect(result.showPrintableDocketRecord).toBe(
        mockCanAllowPrintableDocketRecord,
      );
    });
  });

  describe('sortLabelTextMobile', () => {
    const sortLabelsMobile = {
      byDate: 'Oldest to Newest',
      byDateDesc: 'Newest to Oldest',
    };

    Object.entries(sortLabelsMobile).forEach(([sortType, sortLabel]) => {
      it(`should be ${sortLabel} when the sortOrder is ${sortType}`, () => {
        const result = runCompute(docketRecordHelper, {
          state: {
            caseDetail: {
              canAllowPrintableDocketRecord: true,
              docketNumber: mockDocketNumber,
            },
            permissions: {},
            sessionMetadata: {
              docketRecordSort: {
                [mockDocketNumber]: sortType,
              },
            },
          },
        });

        expect(result.sortLabelTextMobile).toBe(sortLabel);
      });
    });
  });
});
