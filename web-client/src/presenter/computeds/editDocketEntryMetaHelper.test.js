import { applicationContext } from '../../applicationContext';
import { editDocketEntryMetaHelper as editDocketEntryMetaHelperComputed } from './editDocketEntryMetaHelper';
import { runCompute } from 'cerebral/test';
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
            documentId: '123',
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
            documents: [],
            partyType: PARTY_TYPES.petitioner,
          },
          form: {
            documentId: '123',
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
            documents: [],
            partyType: PARTY_TYPES.petitioner,
          },
          form: {
            documentId: '123',
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
            documentId: '123',
            documentType: 'Answer',
          },
        },
      });
      expect(result.showObjection).toBeFalsy();
    });
  });
});
