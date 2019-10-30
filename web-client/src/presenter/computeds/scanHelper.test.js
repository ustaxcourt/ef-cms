import { User } from '../../../../shared/src/business/entities/User';
import { runCompute } from 'cerebral/test';
import { scanHelper as scanHelperComputed } from './scanHelper';
import { withAppContextDecorator } from '../../../src/withAppContext';

const scanHelper = withAppContextDecorator(scanHelperComputed, {
  getUtilities: () => {
    return {
      isInternalUser: User.isInternalUser,
    };
  },
});

describe('scanHelper', () => {
  it('sets hasScanFeature to `true` for `petitionsclerk` user roles', () => {
    const result = runCompute(scanHelper, {
      state: {
        user: {
          role: User.ROLES.petitionsClerk,
        },
      },
    });
    expect(result.hasScanFeature).toBeTruthy();
  });

  it('sets hasScanFeature to `true` for `docketclerk` user roles', () => {
    const result = runCompute(scanHelper, {
      state: {
        user: {
          role: User.ROLES.docketClerk,
        },
      },
    });
    expect(result.hasScanFeature).toBeTruthy();
  });

  it('sets hasScanFeature to `true` for `adc` user roles', () => {
    const result = runCompute(scanHelper, {
      state: {
        user: {
          role: User.ROLES.adc,
        },
      },
    });
    expect(result.hasScanFeature).toBeTruthy();
  });

  it('sets hasScanFeature to `false` for `petitioner` user roles', () => {
    const result = runCompute(scanHelper, {
      state: {
        user: {
          role: User.ROLES.petitioner,
        },
      },
    });
    expect(result.hasScanFeature).toBeFalsy();
  });

  it('sets hasScanFeature to `false` for `practitioner` user roles', () => {
    const result = runCompute(scanHelper, {
      state: {
        user: {
          role: User.ROLES.practitioner,
        },
      },
    });
    expect(result.hasScanFeature).toBeFalsy();
  });

  it('sets hasScanFeature to `false` for `respondent` user roles', () => {
    const result = runCompute(scanHelper, {
      state: {
        user: {
          role: User.ROLES.respondent,
        },
      },
    });
    expect(result.hasScanFeature).toBeFalsy();
  });

  it('shows the scanner source selection modal', () => {
    const result = runCompute(scanHelper, {
      state: {
        showModal: 'SelectScannerSourceModal',
      },
    });
    expect(result.showScannerSourceModal).toBeTruthy();
  });

  it('gets the scanner sources from state', () => {
    const mockSources = ['Test Source 1', 'Test Source 2'];
    const result = runCompute(scanHelper, {
      state: {
        scanner: {
          sources: mockSources,
        },
      },
    });
    expect(result.sources.length).toEqual(2);
  });

  it('sets applicationForWaiverOfFilingFeeFileCompleted if document is on form', () => {
    const result = runCompute(scanHelper, {
      state: {
        form: {
          applicationForWaiverOfFilingFeeFile: null,
        },
      },
    });
    expect(result.applicationForWaiverOfFilingFeeFileCompleted).toBeFalsy();

    const result2 = runCompute(scanHelper, {
      state: {
        form: {
          applicationForWaiverOfFilingFeeFile: {},
        },
      },
    });
    expect(result2.applicationForWaiverOfFilingFeeFileCompleted).toBeTruthy();
  });
});
