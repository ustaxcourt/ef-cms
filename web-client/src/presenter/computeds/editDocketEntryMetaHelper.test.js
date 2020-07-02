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
  let PARTY_TYPES;

  beforeAll(() => {
    ({ PARTY_TYPES } = applicationContext.getConstants());
  });

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

  describe('partyValidationError', () => {
    it('should return "error" if there are party validation errors for a primary party', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          caseDetail: {
            partyType: PARTY_TYPES.petitioner,
          },
          form: {
            documentId: '123',
          },
          validationErrors: {
            partyPrimary: 'error',
          },
        },
      });
      expect(result.partyValidationError).toEqual('error');
    });

    it('should return "error" if there are party validation errors for a secondary party', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          caseDetail: {
            partyType: PARTY_TYPES.petitioner,
          },
          form: {
            documentId: '123',
          },
          validationErrors: {
            partySecondary: 'error',
          },
        },
      });
      expect(result.partyValidationError).toEqual('error');
    });

    it('should return "error" if there are party validation errors for a respondent party', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          caseDetail: {
            partyType: PARTY_TYPES.petitioner,
          },
          form: {
            documentId: '123',
          },
          validationErrors: {
            partyIrsPractitioner: 'error',
          },
        },
      });
      expect(result.partyValidationError).toEqual('error');
    });

    it('should be falsy if there are no party validation errors at all', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          caseDetail: {
            partyType: PARTY_TYPES.petitioner,
          },
          form: {
            documentId: '123',
          },
          validationErrors: {},
        },
      });
      expect(result.partyValidationError).toBeFalsy();
    });
  });
  describe('showSecondaryParty', () => {
    it('should show secondary party if party type is petitioner and spouse', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          caseDetail: {
            partyType: 'Petitioner & spouse',
          },
          form: {
            documentId: '123',
          },
          validationErrors: {},
        },
      });
      expect(result.showSecondaryParty).toBeTruthy();
    });

    it('should show secondary party if party type is petitioner and deceased spouse', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          caseDetail: {
            partyType: 'Petitioner & deceased spouse',
          },
          form: {
            documentId: '123',
          },
          validationErrors: {},
        },
      });
      expect(result.showSecondaryParty).toBeTruthy();
    });

    it('should not show secondary party if party type is anything other than petitioner and their spouse', () => {
      const result = runCompute(editDocketEntryMetaHelper, {
        state: {
          caseDetail: {
            partyType: PARTY_TYPES.petitioner,
          },
          form: {
            documentId: '123',
          },
          validationErrors: {},
        },
      });
      expect(result.showSecondaryParty).toBeFalsy();
    });
  });
});
