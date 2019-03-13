import { dashboardRespondentHelper } from './dashboardRespondentHelper';
import { runCompute } from 'cerebral/test';

describe('respondent dashboard helper', () => {
  it('shows "no cases" but not case list when there are no cases', () => {
    const result = runCompute(dashboardRespondentHelper, {
      state: {
        cases: [],
      },
    });
    expect(result.showCaseList).toEqual(false);
    expect(result.showNoCasesMessage).toEqual(true);
  });
  it('shows case list but not "no cases" when there is a case', () => {
    const result = runCompute(dashboardRespondentHelper, {
      state: {
        cases: [{ something: true }],
      },
    });
    expect(result.showCaseList).toEqual(true);
    expect(result.showNoCasesMessage).toEqual(false);
  });
});
