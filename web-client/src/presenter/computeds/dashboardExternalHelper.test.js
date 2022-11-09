import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { dashboardExternalHelper as dashboardExternalHelperComputed } from './dashboardExternalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const dashboardExternalHelper = withAppContextDecorator(
  dashboardExternalHelperComputed,
  applicationContext,
);

describe('dashboardExternalHelper', () => {
  it('shows "what to expect" but not case list when there are no open or closed cases', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.petitioner,
    });
    const result = runCompute(dashboardExternalHelper, {
      state: {
        closedCases: [],
        openCases: [],
      },
    });
    expect(result.showCaseList).toEqual(false);
    expect(result.showWhatToExpect).toEqual(true);
  });

  it('shows case list but not "what to expect" when there is an open or closed case case', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.petitioner,
    });
    const result = runCompute(dashboardExternalHelper, {
      state: {
        closedCases: [{ something: true }],
        openCases: [{ something: true }],
      },
    });
    expect(result.showCaseList).toEqual(true);
    expect(result.showWhatToExpect).toEqual(false);
  });
});
