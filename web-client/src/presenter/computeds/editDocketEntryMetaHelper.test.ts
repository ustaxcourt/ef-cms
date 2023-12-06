import { applicationContext } from '../../applicationContext';
import { editDocketEntryMetaHelper as editDocketEntryMetaHelperComputed } from './editDocketEntryMetaHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

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
            strickenBy: 'Guy Fieri',
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
});
