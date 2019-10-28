import { ContactFactory } from '../../../../shared/src/business/entities/contacts/ContactFactory';
import { User } from '../../../../shared/src/business/entities/User';
import { getTrialCityName } from '../computeds/formattedTrialCity';
import { runCompute } from 'cerebral/test';
import { startCaseHelper as startCaseHelperComputed } from './startCaseHelper';
import { withAppContextDecorator } from '../../withAppContext';

const startCaseHelper = withAppContextDecorator(startCaseHelperComputed);

const baseState = {
  constants: {
    PARTY_TYPES: ContactFactory.PARTY_TYPES,
    USER_ROLES: User.ROLES,
  },
};

describe('start a case computed', () => {
  it('sets showPetitionFileValid false when the petition file is not added to the petition', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        ...baseState,
        form: {},
        getTrialCityName,
      },
    });
    expect(result.showPetitionFileValid).toBeFalsy();
  });

  it('sets showPetitionFileValid when the petition file is added to the petition', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        ...baseState,
        form: { petitionFile: true },
        getTrialCityName,
      },
    });
    expect(result.showPetitionFileValid).toBeTruthy();
  });

  it('sets showOwnershipDisclosure when the party is business', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        ...baseState,
        form: {
          filingType: 'A business',
          partyType: true,
          petitionFile: true,
        },
        getTrialCityName,
      },
    });
    expect(result.showOwnershipDisclosure).toBeTruthy();
  });

  it('clears showOwnershipDisclosure when the party is not business', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        ...baseState,
        form: {
          filingType: 'not A business',
          partyType: true,
          petitionFile: true,
        },
        getTrialCityName,
      },
    });
    expect(result.showOwnershipDisclosure).toBeFalsy();
  });

  it('sets showHasIrsNoticeOptions when hasIrsNotice is Yes', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        ...baseState,
        form: {
          hasIrsNotice: true,
        },
        getTrialCityName,
      },
    });
    expect(result.showHasIrsNoticeOptions).toBeTruthy();
    expect(result.showNotHasIrsNoticeOptions).toBeFalsy();
  });

  it('sets showNotHasIrsNoticeOptions when hasIrsNotice is No', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        ...baseState,
        form: {
          hasIrsNotice: false,
        },
        getTrialCityName,
      },
    });
    expect(result.showNotHasIrsNoticeOptions).toBeTruthy();
    expect(result.showHasIrsNoticeOptions).toBeFalsy();
  });
});
