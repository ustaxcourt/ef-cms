import { PARTY_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { filingPartiesFormHelper as filingPartiesFormHelperComputed } from './filingPartiesFormHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const baseState = {
  caseDetail: {},
  form: {},
  validationErrors: {},
};

const filingPartiesFormHelper = withAppContextDecorator(
  filingPartiesFormHelperComputed,
  applicationContext,
);

describe('filingPartiesFormHelper', () => {
  it('shows secondary party for petitionerSpouse or petitionerDeceasedSpouse', () => {
    const result = runCompute(filingPartiesFormHelper, {
      state: {
        ...baseState,
        caseDetail: { partyType: PARTY_TYPES.petitionerSpouse },
      },
    });

    expect(result.showSecondaryParty).toBeTruthy();
  });

  it('does not show secondary party for petitioner', () => {
    const result = runCompute(filingPartiesFormHelper, {
      state: {
        ...baseState,
        caseDetail: { partyType: PARTY_TYPES.petitioner },
      },
    });

    expect(result.showSecondaryParty).toBeFalsy();
  });

  it('does not show party validation error if none of the party validation errors exists', () => {
    const result = runCompute(filingPartiesFormHelper, { state: baseState });

    expect(result.partyValidationError).toBeUndefined();
  });

  it('shows party validation error if any one of the party validation errors exists', () => {
    const result = runCompute(filingPartiesFormHelper, {
      state: {
        ...baseState,
        validationErrors: { filers: 'You did something bad.' },
      },
    });

    expect(result.partyValidationError).toEqual('You did something bad.');
  });

  it('returns noMargin true if document in the form is an objection', () => {
    const result = runCompute(filingPartiesFormHelper, {
      state: {
        ...baseState,
        form: {
          documentType: 'Motion for Leave to File',
          eventCode: 'M115',
          scenario: 'Nonstandard H',
        },
      },
    });

    expect(result.noMargin).toBeTruthy();
  });

  it('returns noMargin false if document in the form is not an objection', () => {
    const result = runCompute(filingPartiesFormHelper, {
      state: {
        ...baseState,
        form: {
          documentType: 'Answer',
          eventCode: 'A',
          scenario: 'Standard',
        },
      },
    });

    expect(result.noMargin).toBeFalsy();
  });

  it('returns noMargin true if document in the form is an amendment and previous document is a motion', () => {
    const result = runCompute(filingPartiesFormHelper, {
      state: {
        ...baseState,
        form: {
          documentType: 'Amended',
          eventCode: 'AMAT',
          previousDocument: {
            documentType: 'Motion for Leave to File',
            eventCode: 'M115',
            scenario: 'Nonstandard H',
          },
          scenario: 'Nonstandard F',
        },
      },
    });

    expect(result.noMargin).toBeTruthy();
  });

  it('returns noMargin false if document in the form is an amendment and previous document is not a motion', () => {
    const result = runCompute(filingPartiesFormHelper, {
      state: {
        ...baseState,
        form: {
          documentType: 'Amended',
          eventCode: 'AMAT',
          previousDocument: {
            documentType: 'Answer',
            eventCode: 'A',
            scenario: 'Standard',
          },
          scenario: 'Nonstandard F',
        },
      },
    });

    expect(result.noMargin).toBeFalsy();
  });

  describe('isServed', () => {
    it('should be true when the docket entry has been served', () => {
      applicationContext.getUtilities().isServed.mockReturnValue(true);

      const result = runCompute(filingPartiesFormHelper, {
        state: baseState,
      });

      expect(result.isServed).toBeTruthy();
    });

    it('should be false when the docket entry has not been served', () => {
      applicationContext.getUtilities().isServed.mockReturnValue(false);

      const result = runCompute(filingPartiesFormHelper, {
        state: baseState,
      });

      expect(result.isServed).toBeFalsy();
    });
  });
});
