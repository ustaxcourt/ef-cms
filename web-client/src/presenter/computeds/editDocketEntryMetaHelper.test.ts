import { applicationContext } from '../../applicationContext';
import { editDocketEntryMetaHelper as editDocketEntryMetaHelperComputed } from './editDocketEntryMetaHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';
import { MOCK_CASE } from '@shared/test/mockCase';
import { ATP_DOCKET_ENTRY } from '@shared/test/mockDocketEntry';

const editDocketEntryMetaHelper = withAppContextDecorator(
  editDocketEntryMetaHelperComputed,
  {
    ...applicationContext,
  },
);

describe('editDocketEntryMetaHelper', () => {
  const { PARTY_TYPES } = applicationContext.getConstants();

  describe('showObjection', () => {
    it('should show objection field if the documentType allows (e.g. Motions)', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          caseDetail: {
            partyType: PARTY_TYPES.petitioner,
          },
          form: {
            docketEntryId: '123',
            documentType: 'Motion to Withdraw as Counsel',
          },
        },
      });
      expect(result.showObjection).toBeTruthy();
    });

    it('should show objection field if the form event code is an amendment and previous document type is a motion', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          caseDetail: {
            docketEntries: [],
            partyType: PARTY_TYPES.petitioner,
          },
          form: {
            docketEntryId: '123',
            documentType: 'Amendment [anything]',
            eventCode: 'ADMT',
            previousDocument: {
              documentType: 'Motion to Withdraw as Counsel',
            },
          },
        },
      });
      expect(result.showObjection).toBeTruthy();
    });

    it('should not show objection field if the form event code is an amendment and previous document type is not a motion', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          caseDetail: {
            docketEntries: [],
            partyType: PARTY_TYPES.petitioner,
          },
          form: {
            docketEntryId: '123',
            documentType: 'Amendment [anything]',
            eventCode: 'ADMT',
            previousDocument: {
              documentType: 'Answer',
            },
          },
        },
      });
      expect(result.showObjection).toBeFalsy();
    });

    it('should not show objection field if the documentType is not a Motion', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          caseDetail: {
            partyType: PARTY_TYPES.petitioner,
          },
          form: {
            docketEntryId: '123',
            documentType: 'Answer',
          },
        },
      });
      expect(result.showObjection).toBeFalsy();
    });

    it('should show stricken information if the docket entry is stricken', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          caseDetail: {
            partyType: PARTY_TYPES.petitioner,
          },
          form: {
            docketEntryId: '123',
            documentType: 'Answer',
            isStricken: true,
            strickenAt: '2019-03-01T21:40:46.415Z',
            strickenBy: 'Roslindis Angelino',
          },
        },
      });

      expect(result.strickenAtFormatted).toEqual('03/01/2019');
    });
  });

  it('should show the secondary document form for a Nonstandard H document type', () => {
    const result = runCompute(editDocketEntryMetaHelper, {
      state: {
        caseDetail: {
          docketEntries: [],
          partyType: PARTY_TYPES.petitioner,
        },
        docketEntryId: 'e097200c-031a-4520-b306-5e1e4b1e2cc7',
        form: {
          docketEntryId: 'e097200c-031a-4520-b306-5e1e4b1e2cc7',
          documentType: 'Motion for Leave to File',
          eventCode: 'M115',
        },
      },
    });

    expect(result.primary.showSecondaryDocumentForm).toBeTruthy();
  });

  it('should not show the secondary document form for a Nonstandard A document type', () => {
    const result = runCompute(editDocketEntryMetaHelper, {
      state: {
        caseDetail: {
          docketEntries: [],
          partyType: PARTY_TYPES.petitioner,
        },
        docketEntryId: 'e097200c-031a-4520-b306-5e1e4b1e2cc7',
        form: {
          docketEntryId: 'e097200c-031a-4520-b306-5e1e4b1e2cc7',
          documentType: 'Notice of No Objection',
          eventCode: 'NNOB',
        },
      },
    });

    expect(result.primary.showSecondaryDocumentForm).toBeFalsy();
  });

  it('should use caseDetail to calculate option categories when multiDocketedOriginalCaseDetail is undefined', () => {
    const MOCK_PREV_FILED_DOCKET_ENTRY = {
      ...ATP_DOCKET_ENTRY,
      docketNumber: MOCK_CASE.docketNumber,
    };
    const MOCK_PREV_FILED_DOCKET_ENTRY_ID =
      '9878f7f8-7152-4bca-9e26-9fff2e3ee3bc';

    const result = runCompute(editDocketEntryMetaHelper, {
      state: {
        caseDetail: {
          ...MOCK_CASE,
          docketEntries: [MOCK_PREV_FILED_DOCKET_ENTRY],
        },
        docketEntryId: MOCK_PREV_FILED_DOCKET_ENTRY_ID,
        form: {
          docketEntryId: MOCK_PREV_FILED_DOCKET_ENTRY_ID,
          documentType: 'Notice of No Objection',
          eventCode: 'NNOB',
        },
        multiDocketedOriginalCaseDetail: undefined,
      },
    });

    expect(result.primary.previouslyFiledDocuments).toEqual([
      expect.objectContaining({
        documentTitle: MOCK_PREV_FILED_DOCKET_ENTRY.documentTitle,
      }),
    ]);
  });

  it('should use multiDocketedOriginalCaseDetail to calculate option categories when multiDocketedOriginalCaseDetail is defined', () => {
    const MOCK_PREV_FILED_DOCKET_ENTRY = {
      ...ATP_DOCKET_ENTRY,
      docketNumber: MOCK_CASE.docketNumber,
    };
    const MOCK_PREV_FILED_DOCKET_ENTRY_ID =
      '9878f7f8-7152-4bca-9e26-9fff2e3ee3bc';

    const result = runCompute(editDocketEntryMetaHelper, {
      state: {
        caseDetail: {},
        docketEntryId: MOCK_PREV_FILED_DOCKET_ENTRY_ID,
        form: {
          docketEntryId: MOCK_PREV_FILED_DOCKET_ENTRY_ID,
          documentType: 'Notice of No Objection',
          eventCode: 'NNOB',
        },
        multiDocketedOriginalCaseDetail: {
          ...MOCK_CASE,
          docketEntries: [MOCK_PREV_FILED_DOCKET_ENTRY],
        },
      },
    });

    expect(result.primary.previouslyFiledDocuments).toEqual([
      expect.objectContaining({
        documentTitle: MOCK_PREV_FILED_DOCKET_ENTRY.documentTitle,
      }),
    ]);
  });

  describe('consolidatedCasesToDisplay', () => {
    it('should return an empty array when there are no consolidated cases', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          caseDetail: {
            docketNumber: '101-20',
            partyType: PARTY_TYPES.petitioner,
          },
          form: {
            docketEntryId: '123',
            documentType: 'Answer',
          },
          formattedCaseDetail: {
            consolidatedCases: undefined,
          },
        },
      });

      expect(result.consolidatedCasesToDisplay).toEqual([]);
    });

    it('should return an empty array when formattedCaseDetail is undefined', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          caseDetail: {
            docketNumber: '101-20',
            partyType: PARTY_TYPES.petitioner,
          },
          form: {
            docketEntryId: '123',
            documentType: 'Answer',
          },
        },
      });

      expect(result.consolidatedCasesToDisplay).toEqual([]);
    });

    it('should filter out the current case and return other consolidated cases', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          caseDetail: {
            docketNumber: '101-20',
            partyType: PARTY_TYPES.petitioner,
          },
          form: {
            docketEntryId: '123',
            documentType: 'Answer',
          },
          formattedCaseDetail: {
            docketNumber: '101-20',
            consolidatedCases: [
              {
                caseCaption: 'Lead Case Caption',
                caseTitle: 'Lead Case Title',
                docketNumber: '101-20',
              },
              {
                caseCaption: 'Member Case 1 Caption',
                caseTitle: 'Member Case 1 Title',
                docketNumber: '102-20',
              },
              {
                caseCaption: 'Member Case 2 Caption',
                caseTitle: 'Member Case 2 Title',
                docketNumber: '103-20',
              },
            ],
          },
        },
      });

      expect(result.consolidatedCasesToDisplay).toEqual([
        {
          caseCaption: 'Member Case 1 Caption',
          caseTitle: 'Member Case 1 Title',
          docketNumber: '102-20',
        },
        {
          caseCaption: 'Member Case 2 Caption',
          caseTitle: 'Member Case 2 Title',
          docketNumber: '103-20',
        },
      ]);
    });

    it('should return consolidated cases with only the required properties', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          caseDetail: {
            docketNumber: '101-20',
            partyType: PARTY_TYPES.petitioner,
          },
          form: {
            docketEntryId: '123',
            documentType: 'Answer',
          },
          formattedCaseDetail: {
            docketNumber: '101-20',
            consolidatedCases: [
              {
                caseCaption: 'Lead Case Caption',
                caseTitle: 'Lead Case Title',
                docketNumber: '101-20',
                otherProperty: 'should not be included',
              },
              {
                caseCaption: 'Member Case Caption',
                caseTitle: 'Member Case Title',
                docketNumber: '102-20',
                anotherProperty: 'should not be included',
              },
            ],
          },
        },
      });

      expect(result.consolidatedCasesToDisplay).toEqual([
        {
          caseCaption: 'Member Case Caption',
          caseTitle: 'Member Case Title',
          docketNumber: '102-20',
        },
      ]);
      expect(result.consolidatedCasesToDisplay[0]).not.toHaveProperty(
        'anotherProperty',
      );
    });

    it('should handle consolidated cases with missing optional properties', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          caseDetail: {
            docketNumber: '101-20',
            partyType: PARTY_TYPES.petitioner,
          },
          form: {
            docketEntryId: '123',
            documentType: 'Answer',
          },
          formattedCaseDetail: {
            docketNumber: '101-20',
            consolidatedCases: [
              {
                docketNumber: '101-20',
              },
              {
                docketNumber: '102-20',
              },
            ],
          },
        },
      });

      expect(result.consolidatedCasesToDisplay).toEqual([
        {
          caseCaption: undefined,
          caseTitle: undefined,
          docketNumber: '102-20',
        },
      ]);
    });
  });
});
