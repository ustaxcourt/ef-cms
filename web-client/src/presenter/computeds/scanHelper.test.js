import { runCompute } from 'cerebral/test';
import { scanHelper } from './scanHelper';

describe('scanHelper', () => {
  it('sets hasScanFeature to `true` for `petitionsclerk` user roles', () => {
    const result = runCompute(scanHelper, {
      state: {
        user: {
          role: 'petitionsclerk',
        },
      },
    });
    expect(result.hasScanFeature).toBeTruthy();
  });

  it('sets hasScanFeature to `true` for `docketclerk` user roles', () => {
    const result = runCompute(scanHelper, {
      state: {
        user: {
          role: 'docketclerk',
        },
      },
    });
    expect(result.hasScanFeature).toBeTruthy();
  });

  it('sets hasScanFeature to `true` for `seniorattorney` user roles', () => {
    const result = runCompute(scanHelper, {
      state: {
        user: {
          role: 'seniorattorney',
        },
      },
    });
    expect(result.hasScanFeature).toBeTruthy();
  });

  it('sets hasScanFeature to `false` for `petitioner` user roles', () => {
    const result = runCompute(scanHelper, {
      state: {
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result.hasScanFeature).toBeFalsy();
  });

  it('sets hasScanFeature to `false` for `practitioner` user roles', () => {
    const result = runCompute(scanHelper, {
      state: {
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result.hasScanFeature).toBeFalsy();
  });

  it('sets hasScanFeature to `false` for `respondent` user roles', () => {
    const result = runCompute(scanHelper, {
      state: {
        user: {
          role: 'respondent',
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
});
