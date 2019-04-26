import { dashboardPetitionerHelper } from './dashboardPetitionerHelper';
import { runCompute } from 'cerebral/test';

describe('petitioner dashboard helper', () => {
  it('shows "what to expect" but not case list when there are no cases', () => {
    const result = runCompute(dashboardPetitionerHelper, {
      state: {
        cases: [],
      },
    });
    expect(result.showCaseList).toEqual(false);
    expect(result.showWhatToExpect).toEqual(true);
    expect(result.showCaseSearch).toEqual(false);
  });
  it('shows case list but not "what to expect" when there is a case', () => {
    const result = runCompute(dashboardPetitionerHelper, {
      state: {
        cases: [{ something: true }],
      },
    });
    expect(result.showCaseList).toEqual(true);
    expect(result.showWhatToExpect).toEqual(false);
    expect(result.showCaseSearch).toEqual(false);
  });
  it('shows case search if defined user has practitioner role', () => {
    const result = runCompute(dashboardPetitionerHelper, {
      state: {
        cases: [{ something: true }],
        user: { role: 'practitioner' },
      },
    });
    expect(result.showCaseList).toEqual(true);
    expect(result.showWhatToExpect).toEqual(false);
    expect(result.showCaseSearch).toEqual(true);
  });

  it('hides case search if defined user does not have practitioner role', () => {
    const result = runCompute(dashboardPetitionerHelper, {
      state: {
        cases: [{ something: true }],
        user: { role: 'petitionsclerk' },
      },
    });
    expect(result.showCaseList).toEqual(true);
    expect(result.showWhatToExpect).toEqual(false);
    expect(result.showCaseSearch).toEqual(false);
  });
});
