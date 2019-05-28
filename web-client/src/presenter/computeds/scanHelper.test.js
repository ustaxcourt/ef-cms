import { runCompute } from 'cerebral/test';
import { scanHelper } from './scanHelper';

describe('scanHelper', () => {
  it('sets hasScanFeature to `true` for `petitionsclerk` user roles', async () => {
    const result = await runCompute(scanHelper, {
      state: {
        user: {
          role: 'petitionsclerk',
        },
      },
    });
    expect(result.hasScanFeature).toBeTruthy();
  });

  it('sets hasScanFeature to `true` for `docketclerk` user roles', async () => {
    const result = await runCompute(scanHelper, {
      state: {
        user: {
          role: 'docketclerk',
        },
      },
    });
    expect(result.hasScanFeature).toBeTruthy();
  });

  it('sets hasScanFeature to `true` for `seniorattorney` user roles', async () => {
    const result = await runCompute(scanHelper, {
      state: {
        user: {
          role: 'seniorattorney',
        },
      },
    });
    expect(result.hasScanFeature).toBeTruthy();
  });

  it('sets hasScanFeature to `false` for `petitioner` user roles', async () => {
    const result = await runCompute(scanHelper, {
      state: {
        user: {
          role: 'petitioner',
        },
      },
    });
    expect(result.hasScanFeature).toBeFalsy();
  });

  it('sets hasScanFeature to `false` for `practitioner` user roles', async () => {
    const result = await runCompute(scanHelper, {
      state: {
        user: {
          role: 'practitioner',
        },
      },
    });
    expect(result.hasScanFeature).toBeFalsy();
  });

  it('sets hasScanFeature to `false` for `respondent` user roles', async () => {
    const result = await runCompute(scanHelper, {
      state: {
        user: {
          role: 'respondent',
        },
      },
    });
    expect(result.hasScanFeature).toBeFalsy();
  });
});
