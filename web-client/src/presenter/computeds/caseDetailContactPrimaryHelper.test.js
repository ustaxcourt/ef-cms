import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
import { caseDetailContactPrimaryHelper as caseDetailContactPrimaryHelperComputed } from './caseDetailContactPrimaryHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const state = {
  caseDetail: MOCK_CASE,
  form: {},
  validationErrors: {},
};

const caseDetailContactPrimaryHelper = withAppContextDecorator(
  caseDetailContactPrimaryHelperComputed,
  applicationContext,
);

describe('caseDetailContactPrimaryHelper', () => {
  it('returns contactPrimaryName from case detail petitioners array', () => {
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

    const { contactPrimary } = runCompute(caseDetailContactPrimaryHelper, {
      state,
    });

    expect(contactPrimary.name).toEqual('Test Petitioner');
  });
});
