import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { PARTY_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { contactEditHelper as contactEditHelperComputed } from './contactEditHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const state = {
  caseDetail: MOCK_CASE,
  form: {},
  validationErrors: {},
};

const contactEditHelper = withAppContextDecorator(
  contactEditHelperComputed,
  applicationContext,
);

describe('contactEditHelper', () => {
  it('should set primary showInCareOf to true when the caseDetail partyType is corporation', () => {
    let testState = {
      ...state,
      caseDetail: {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.corporation,
      },
    };

    const result = runCompute(contactEditHelper, {
      state: testState,
    });
    expect(result.contactPrimary.showInCareOf).toBeTruthy();
  });

  it('should set contactPrimary.showInCareOf to true when the caseDetail partyType is estateWithoutExecutor', () => {
    let testState = {
      ...state,
      caseDetail: {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.estateWithoutExecutor,
      },
    };

    const result = runCompute(contactEditHelper, {
      state: testState,
    });
    expect(result.contactPrimary.showInCareOf).toBeTruthy();
  });

  it('should set secondary showInCareOf to true when the caseDetail partyType is petitionerDeceasedSpouse', () => {
    let testState = {
      ...state,
      caseDetail: {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.petitionerDeceasedSpouse,
      },
    };

    const result = runCompute(contactEditHelper, {
      state: testState,
    });
    expect(result.contactSecondary.showInCareOf).toBeTruthy();
  });

  it('should return undefined for contactPrimary and contactSecondary for other party types', () => {
    let testState = {
      ...state,
      caseDetail: {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.guardian,
      },
    };

    const result = runCompute(contactEditHelper, {
      state: testState,
    });
    expect(result.contactPrimary).toBeUndefined();
    expect(result.contactSecondary).toBeUndefined();
  });
});
