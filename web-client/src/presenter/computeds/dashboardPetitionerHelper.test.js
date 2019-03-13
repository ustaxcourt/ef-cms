import { dashboardPetitionerHelper } from './dashboardPetitionerHelper';
import { runCompute } from 'cerebral/test';

describe('petitioner dashboard helper', () => {
  it('shows the right things when there are no cases', () => {
    const result = runCompute(dashboardPetitionerHelper, {
      state: {
        cases: [],
      },
    });
    expect(result.showCaseList).toEqual(false);
    expect(result.showWhatToExpect).toEqual(true);
  });
  it('shows the right things when there are no cases', () => {
    const result = runCompute(dashboardPetitionerHelper, {
      state: {
        cases: [{ something: true }],
      },
    });
    expect(result.showCaseList).toEqual(true);
    expect(result.showWhatToExpect).toEqual(false);
  });
});
