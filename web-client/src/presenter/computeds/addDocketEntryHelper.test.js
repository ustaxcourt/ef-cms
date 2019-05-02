import { runCompute } from 'cerebral/test';

import {
  CATEGORY_MAP,
  INTERNAL_CATEGORY_MAP,
} from '../../../../shared/src/business/entities/Document';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { PARTY_TYPES } from '../../../../shared/src/business/entities/contacts/PetitionContact';

const state = {
  caseDetail: MOCK_CASE,
  constants: {
    CATEGORY_MAP,
    INTERNAL_CATEGORY_MAP,
    PARTY_TYPES,
  },
  form: {},
  validationErrors: {},
};

import { addDocketEntryHelper } from './addDocketEntryHelper';

describe('addDocketEntryHelper', () => {
  beforeEach(() => {
    state.form = {};
  });

  it('returns correct values when documentType is undefined', async () => {
    let testState = { ...state, form: { documentType: undefined } };

    const expected = {
      showObjection: false,
      showPrimaryDocumentValid: false,
      showSecondaryDocumentValid: false,
      showSecondaryParty: false,
    };

    const result = await runCompute(addDocketEntryHelper, {
      state: testState,
    });
    expect(result).toMatchObject(expected);
    expect(Array.isArray(result.supportingDocumentTypeList)).toBeTruthy();
  });

  it('shows objection if document type is a motion', async () => {
    state.form = { documentType: 'Motion for Leave to File' };
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.showObjection).toBeTruthy();
  });

  it('indicates file uploads are valid', async () => {
    state.form = {
      documentType: 'Agreed Computation for Entry of Decision',
      primaryDocumentFile: { some: 'file' },
    };

    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.showPrimaryDocumentValid).toBeTruthy();
  });

  it('shows secondary party for petionerSpouse or petitionerDeceasedSpouse', async () => {
    state.caseDetail.partyType = PARTY_TYPES.petitionerSpouse;
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.showSecondaryParty).toBeTruthy();
  });

  it('generates correctly formatted service date', async () => {
    state.form.certificateOfServiceDate = '2012-05-31';
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toEqual('05/31/2012');
  });

  it('does not generate a formatted service date if a service date is not entered on the form', async () => {
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toBeUndefined();
  });

  it('does not show party validation error if none of the party validation errors exists', async () => {
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.partyValidationError).toBeUndefined();
  });

  it('shows party validation error if any one of the party validation errors exists', async () => {
    state.validationErrors = { partyPrimary: 'You did something bad.' };
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.partyValidationError).toEqual('You did something bad.');
  });

  it('does not show respondent option under Parties Filing if respondent is not associated with case', async () => {
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.showRespondentParty).toBeFalsy();
  });

  it('shows respondent option under Parties Filing if respondent is associated with case', async () => {
    state.caseDetail.respondent = { name: 'Test Respondent' };
    const result = await runCompute(addDocketEntryHelper, { state });
    expect(result.showRespondentParty).toBeTruthy();
  });
});
