import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
import { caseDetailContactHelper as caseDetailContactHelperComputed } from './caseDetailContactHelper';
import { getContactPrimary } from '../../../../shared/src/business/entities/cases/Case';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const state = {
  caseDetail: MOCK_CASE,
  form: {},
  validationErrors: {},
};

const caseDetailContactHelper = withAppContextDecorator(
  caseDetailContactHelperComputed,
  applicationContext,
);

describe('caseDetailContactHelper', () => {
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

    const { contactPrimary } = runCompute(caseDetailContactHelper, {
      state,
    });

    expect(contactPrimary.name).toEqual('Test Petitioner');
  });

  it('returns contactSecondaryName from case detail petitioners array', () => {
    state.caseDetail.petitioners.push({
      ...getContactPrimary(MOCK_CASE),
      contactType: CONTACT_TYPES.secondary,
      name: 'Test A Different One',
    });

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

    const { contactSecondary } = runCompute(caseDetailContactHelper, {
      state,
    });

    expect(contactSecondary.name).toEqual('Test A Different One');
  });
});
