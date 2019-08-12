import { runCompute } from 'cerebral/test';
import { trialSessionWorkingCopyHelper } from './trialSessionWorkingCopyHelper';

describe('trial session working copy computed', () => {
  it('computes defaults with no data', () => {
    const result = runCompute(trialSessionWorkingCopyHelper, {});
    expect(result.title).toBeDefined();
  });
});
