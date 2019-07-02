import { ContactFactory } from '../../../../shared/src/business/entities/contacts/ContactFactory';
import { TRIAL_CITIES } from '../../../../shared/src/business/entities/TrialCities';
import { getTrialCityName } from '../computeds/formattedTrialCity';
import { runCompute } from 'cerebral/test';
import { startCaseHelper } from './startCaseHelper';

describe('start a case computed', () => {
  it('sets showPetitionFileValid false when the petition file is not added to the petition', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
          TRIAL_CITIES,
        },
        form: {},
        getTrialCityName,
        petition: {},
      },
    });
    expect(result.showPetitionFileValid).toBeFalsy();
  });

  it('sets showPetitionFileValid when the petition file is added to the petition', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
          TRIAL_CITIES,
        },
        form: {},
        getTrialCityName,
        petition: {
          petitionFile: true,
        },
      },
    });
    expect(result.showPetitionFileValid).toBeTruthy();
  });

  it('sets showOwnershipDisclosure when the party is business', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
          TRIAL_CITIES,
        },
        form: {
          filingType: 'A business',
          partyType: true,
        },
        getTrialCityName,
        petition: {
          petitionFile: true,
        },
      },
    });
    expect(result.showOwnershipDisclosure).toBeTruthy();
  });

  it('clears showOwnershipDisclosure when the party is not business', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
          TRIAL_CITIES,
        },
        form: {
          filingType: 'not A business',
          partyType: true,
        },
        getTrialCityName,
        petition: {
          petitionFile: true,
        },
      },
    });
    expect(result.showOwnershipDisclosure).toBeFalsy();
  });

  it('sets showHasIrsNoticeOptions when hasIrsNotice is Yes', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
          TRIAL_CITIES,
        },
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
        constants: {
          PARTY_TYPES: ContactFactory.PARTY_TYPES,
          TRIAL_CITIES,
        },
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
