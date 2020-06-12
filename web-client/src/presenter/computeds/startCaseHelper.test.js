import {
  FILING_TYPES,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { getTrialCityName } from '../computeds/formattedTrialCity';
import { runCompute } from 'cerebral/test';
import { startCaseHelper as startCaseHelperComputed } from './startCaseHelper';
import { withAppContextDecorator } from '../../withAppContext';

const startCaseHelper = withAppContextDecorator(
  startCaseHelperComputed,
  applicationContext,
);

describe('start a case computed', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.petitioner,
    });
  });

  it('sets showPetitionFileValid false when the petition file is not added to the petition', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {},
        getTrialCityName,
      },
    });
    expect(result.showPetitionFileValid).toBeFalsy();
  });

  it('sets showPetitionFileValid when the petition file is added to the petition', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: { petitionFile: true },
        getTrialCityName,
      },
    });
    expect(result.showPetitionFileValid).toBeTruthy();
  });

  it('sets showOwnershipDisclosure when the party is business', () => {
    const result = runCompute(startCaseHelper, {
      state: {
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
        form: {
          hasIrsNotice: false,
        },
        getTrialCityName,
      },
    });
    expect(result.showNotHasIrsNoticeOptions).toBeTruthy();
    expect(result.showHasIrsNoticeOptions).toBeFalsy();
  });

  it('returns petitioner filing types if user is petitioner role', () => {
    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          hasIrsNotice: false,
        },
        getTrialCityName,
      },
    });
    expect(result.filingTypes).toEqual(FILING_TYPES.petitioner);
  });

  it('returns privatePractitioner filing types if user is privatePractitioner role', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.privatePractitioner,
    });

    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          hasIrsNotice: false,
        },
        getTrialCityName,
      },
    });
    expect(result.filingTypes).toEqual(FILING_TYPES.privatePractitioner);
  });

  it('returns petitioner filing types by default if user is not petitioner or privatePractitioner role', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.irsPractitioner,
    });

    const result = runCompute(startCaseHelper, {
      state: {
        form: {
          hasIrsNotice: false,
        },
        getTrialCityName,
      },
    });
    expect(result.filingTypes).toEqual(FILING_TYPES.petitioner);
  });
});
