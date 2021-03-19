import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { PARTY_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { filingPartiesFormHelper as filingPartiesFormHelperComputed } from './filingPartiesFormHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const state = {
  caseDetail: MOCK_CASE,
  form: {},
  validationErrors: {},
};

const filingPartiesFormHelper = withAppContextDecorator(
  filingPartiesFormHelperComputed,
  applicationContext,
);

describe('filingPartiesFormHelper', () => {
  beforeEach(() => {
    state.form = {};
  });

  it('shows secondary party for petitionerSpouse or petitionerDeceasedSpouse', () => {
    state.caseDetail.partyType = PARTY_TYPES.petitionerSpouse;
    const result = runCompute(filingPartiesFormHelper, { state });
    expect(result.showSecondaryParty).toBeTruthy();
  });

  it('does not show secondary party for petitioner', () => {
    state.caseDetail.partyType = PARTY_TYPES.petitioner;
    const result = runCompute(filingPartiesFormHelper, { state });
    expect(result.showSecondaryParty).toBeFalsy();
  });

  it('does not show party validation error if none of the party validation errors exists', () => {
    const result = runCompute(filingPartiesFormHelper, { state });
    expect(result.partyValidationError).toBeUndefined();
  });

  it('shows party validation error if any one of the party validation errors exists', () => {
    state.validationErrors = { partyPrimary: 'You did something bad.' };
    const result = runCompute(filingPartiesFormHelper, { state });
    expect(result.partyValidationError).toEqual('You did something bad.');
  });

  it('returns noMargin true if document in the form is an objection', () => {
    state.form = {
      documentType: 'Motion for Leave to File',
      eventCode: 'M115',
      scenario: 'Nonstandard H',
    };
    const result = runCompute(filingPartiesFormHelper, { state });
    expect(result.noMargin).toBeTruthy();
  });

  it('returns noMargin false if document in the form is not an objection', () => {
    state.form = {
      documentType: 'Answer',
      eventCode: 'A',
      scenario: 'Standard',
    };
    const result = runCompute(filingPartiesFormHelper, { state });
    expect(result.noMargin).toBeFalsy();
  });

  it('returns noMargin true if document in the form is an amendment and previous document is a motion', () => {
    state.form = {
      documentType: 'Amended',
      eventCode: 'AMAT',
      previousDocument: {
        documentType: 'Motion for Leave to File',
        eventCode: 'M115',
        scenario: 'Nonstandard H',
      },
      scenario: 'Nonstandard F',
    };
    const result = runCompute(filingPartiesFormHelper, { state });
    expect(result.noMargin).toBeTruthy();
  });

  it('returns noMargin false if document in the form is an amendment and previous document is not a motion', () => {
    state.form = {
      documentType: 'Amended',
      eventCode: 'AMAT',
      previousDocument: {
        documentType: 'Answer',
        eventCode: 'A',
        scenario: 'Standard',
      },
      scenario: 'Nonstandard F',
    };
    const result = runCompute(filingPartiesFormHelper, { state });
    expect(result.noMargin).toBeFalsy();
  });
});
