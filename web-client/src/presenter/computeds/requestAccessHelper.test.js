import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

import { CATEGORY_MAP } from '../../../../shared/src/business/entities/Document';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { PARTY_TYPES } from '../../../../shared/src/business/entities/contacts/PetitionContact';
import { requestAccessHelper as requestAccessHelperComputed } from './requestAccessHelper';

const state = {
  caseDetail: MOCK_CASE,
  constants: {
    CATEGORY_MAP,
    PARTY_TYPES,
  },
  form: {},
  validationErrors: {},
};

const requestAccessHelper = withAppContextDecorator(
  requestAccessHelperComputed,
);

describe('requestAccessHelper', () => {
  beforeEach(() => {
    state.form = {};
  });

  it('returns correct values when documentType is undefined', async () => {
    let testState = { ...state, form: { documentType: undefined } };

    const expected = {
      showPrimaryDocumentValid: false,
    };

    const result = await runCompute(requestAccessHelper, {
      state: testState,
    });
    expect(result).toMatchObject(expected);
  });

  it('indicates file uploads are valid', async () => {
    state.form = {
      documentType: 'Entry of Appearance',
      primaryDocumentFile: { some: 'file' },
    };

    const result = await runCompute(requestAccessHelper, { state });
    expect(result.showPrimaryDocumentValid).toBeTruthy();
  });

  it('generates correctly formatted service date', async () => {
    state.form.certificateOfServiceDate = '2012-05-31';
    const result = await runCompute(requestAccessHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toEqual('05/31/12');
  });

  it('does not generate a formatted service date if a service date is not entered on the form', async () => {
    const result = await runCompute(requestAccessHelper, { state });
    expect(result.certificateOfServiceDateFormatted).toBeUndefined();
  });

  it('does not show party validation error if none of the party validation errors exists', async () => {
    const result = await runCompute(requestAccessHelper, { state });
    expect(result.partyValidationError).toBeUndefined();
  });

  it('shows party validation error if any one of the party validation errors exists', async () => {
    state.validationErrors = { representingPrimary: 'You did something bad.' };
    const result = await runCompute(requestAccessHelper, { state });
    expect(result.partyValidationError).toEqual('You did something bad.');
  });

  it('returns correct number of document options for user role practitioner', async () => {
    state.user = { role: 'practitioner' };
    const result = await runCompute(requestAccessHelper, { state });
    expect(result.documents.length).toEqual(6);
  });

  it('returns correct number of document options for user role respondent', async () => {
    state.user = { role: 'respondent' };
    const result = await runCompute(requestAccessHelper, { state });
    expect(result.documents.length).toEqual(2);
  });
});
