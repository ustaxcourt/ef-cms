import { dashboardRespondentHelper } from './dashboardRespondentHelper';
import { runCompute } from 'cerebral/test';

describe('respondent dashboard helper', () => {
  it('shows the right things when there are no cases', () => {
    const result = runCompute(dashboardRespondentHelper, {
      state: {
        cases: [],
      },
    });
    expect(result.showCaseList).toEqual(false);
    expect(result.showNoCasesMessage).toEqual(true);
  });
  it('shows the right things when there are no cases', () => {
    const result = runCompute(dashboardRespondentHelper, {
      state: {
        cases: [{ something: true }],
      },
    });
    expect(result.showCaseList).toEqual(true);
    expect(result.showNoCasesMessage).toEqual(false);
  });
});
