import { ContactFactory } from '../../../../shared/src/business/entities/contacts/ContactFactory';
import { Document } from '../../../../shared/src/business/entities/Document';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { addDocketEntryHelper as addDocketEntryHelperComputed } from './addDocketEntryHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const state = {
  caseDetail: MOCK_CASE,
  constants: {
    CATEGORY_MAP: Document.CATEGORY_MAP,
    INTERNAL_CATEGORY_MAP: Document.INTERNAL_CATEGORY_MAP,
    PARTY_TYPES: ContactFactory.PARTY_TYPES,
  },
  form: {},
  validationErrors: {},
};

const addDocketEntryHelper = withAppContextDecorator(
  addDocketEntryHelperComputed,
);

describe('addDocketEntryHelper', () => {
  beforeEach(() => {
    state.form = {};
  });

  it('returns correct values when documentType is undefined', () => {
    let testState = { ...state, form: { documentType: undefined } };

    const expected = {
      showObjection: false,
      showPrimaryDocumentValid: false,
      showSecondaryDocumentValid: false,
      showSecondaryParty: false,
    };

    const result = runCompute(addDocketEntryHelper, {
      state: testState,
    });
    expect(result).toMatchObject(expected);
    expect(Array.isArray(result.supportingDocumentTypeList)).toBeTruthy();
  });

  it('does not error with empty caseDetail (for cerebral debugger)', () => {
    let testState = {
      caseDetail: {},
      constants: {
        CATEGORY_MAP: Document.CATEGORY_MAP,
        INTERNAL_CATEGORY_MAP: Document.INTERNAL_CATEGORY_MAP,
        PARTY_TYPES: ContactFactory.PARTY_TYPES,
      },
    };

    const result = runCompute(addDocketEntryHelper, {
      state: testState,
    });
    expect(result).toMatchObject({});
  });

  it('shows objection if document type is a motion', () => {
    state.form = {
      documentType: 'Motion for Leave to File',
      eventCode: 'M115',
      scenario: 'Nonstandard H',
    };
    const result = runCompute(addDocketEntryHelper, { state });
    expect(result.showObjection).toBeTruthy();
    expect(result.primary.showSecondaryDocumentForm).toBeTruthy();
  });

  it('indicates file uploads are valid', () => {
    state.form = {
      documentType: 'Agreed Computation for Entry of Decision',
      primaryDocumentFile: { some: 'file' },
    };

    const result = runCompute(addDocketEntryHelper, { state });
    expect(result.showPrimaryDocumentValid).toBeTruthy();
  });

  it('shows secondary party for petitionerSpouse or petitionerDeceasedSpouse', () => {
    state.caseDetail.partyType = ContactFactory.PARTY_TYPES.petitionerSpouse;
    const result = runCompute(addDocketEntryHelper, { state });
    expect(result.showSecondaryParty).toBeTruthy();
  });

  it('generates correctly formatted service date', () => {
    state.form.certificateOfServiceDate = '2012-05-31';
    const result = runCompute(addDocketEntryHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toEqual('05/31/12');
  });

  it('does not generate a formatted service date if a service date is not entered on the form', () => {
    const result = runCompute(addDocketEntryHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toBeUndefined();
  });

  it('does not show party validation error if none of the party validation errors exists', () => {
    const result = runCompute(addDocketEntryHelper, { state });
    expect(result.partyValidationError).toBeUndefined();
  });

  it('shows party validation error if any one of the party validation errors exists', () => {
    state.validationErrors = { partyPrimary: 'You did something bad.' };
    const result = runCompute(addDocketEntryHelper, { state });
    expect(result.partyValidationError).toEqual('You did something bad.');
  });

  it("shows should show inclusions when previous document isn't secondary", () => {
    state.form.previousDocument = 'Statement of Taxpayer Identification';
    state.screenMetadata = {
      filedDocumentIds: ['abc81f4d-1e47-423a-8caf-6d2fdc3d3859'],
    };
    const result = runCompute(addDocketEntryHelper, { state });
    expect(result.showSupportingInclusions).toBeTruthy();
  });

  it('should show track option as default', () => {
    const result = runCompute(addDocketEntryHelper, { state });
    expect(result.showTrackOption).toBeTruthy();
  });

  it('should not show track option for auto-tracked items', () => {
    state.form.eventCode = 'OSC';
    const result = runCompute(addDocketEntryHelper, { state });
    expect(result.showTrackOption).toBeFalsy();
  });
});
