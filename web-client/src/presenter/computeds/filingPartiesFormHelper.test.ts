import {
  AMICUS_BRIEF_EVENT_CODE,
  PARTY_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { DocketEntry } from '../../../../shared/src/business/entities/DocketEntry';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { filingPartiesFormHelper as filingPartiesFormHelperComputed } from './filingPartiesFormHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('filingPartiesFormHelper', () => {
  const baseState = {
    caseDetail: {},
    form: {},
    validationErrors: {},
  };

  const filingPartiesFormHelper = withAppContextDecorator(
    filingPartiesFormHelperComputed,
    applicationContext,
  );

  describe('isServed', () => {
    it('should be true when the docket entry has been served', () => {
      jest.spyOn(DocketEntry, 'isServed').mockReturnValue(true);

      const result = runCompute(filingPartiesFormHelper, {
        state: baseState,
      });

      expect(result.isServed).toBeTruthy();
    });

    it('should be false when the docket entry has not been served', () => {
      jest.spyOn(DocketEntry, 'isServed').mockReturnValue(false);

      const result = runCompute(filingPartiesFormHelper, {
        state: baseState,
      });

      expect(result.isServed).toBeFalsy();
    });
  });

  describe('noMargin', () => {
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
  });

  describe('partyValidationError', () => {
    it('should be undefined when none of the party validation errors exists', () => {
      const result = runCompute(filingPartiesFormHelper, { state: baseState });

      expect(result.partyValidationError).toBeUndefined();
    });

    it('should be defined when validation errors include an entry for filers', () => {
      const result = runCompute(filingPartiesFormHelper, {
        state: {
          ...baseState,
          validationErrors: { filers: 'You did something bad.' },
        },
      });

      expect(result.partyValidationError).toBeDefined();
    });

    it('should be defined when validation errors include an entry for irs practitioners', () => {
      const result = runCompute(filingPartiesFormHelper, {
        state: {
          ...baseState,
          validationErrors: { partyIrsPractitioner: 'You did something bad.' },
        },
      });

      expect(result.partyValidationError).toBeDefined();
    });

    it('should be defined when validation errors include an entry for other filing party', () => {
      const result = runCompute(filingPartiesFormHelper, {
        state: {
          ...baseState,
          validationErrors: { otherFilingParty: 'You did something bad.' },
        },
      });

      expect(result.partyValidationError).toBeDefined();
    });
  });

  describe('showFilingPartiesAsCheckboxes', () => {
    it('returns showFilingPartiesAsCheckboxes true if document in the form is not an Amicus Brief', () => {
      const result = runCompute(filingPartiesFormHelper, {
        state: {
          ...baseState,
          form: {
            documentType: 'Answer',
            eventCode: 'A',
          },
        },
      });

      expect(result.showFilingPartiesAsCheckboxes).toBeTruthy();
    });

    it('returns showFilingPartiesAsCheckboxes false if document in the form is an Amicus Brief', () => {
      const result = runCompute(filingPartiesFormHelper, {
        state: {
          ...baseState,
          form: {
            documentType: 'Amicus Brief',
            eventCode: AMICUS_BRIEF_EVENT_CODE,
          },
        },
      });

      expect(result.showFilingPartiesAsCheckboxes).toBeFalsy();
    });
  });

  describe('showSecondaryParty', () => {
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
  });
});
