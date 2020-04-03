import { User } from '../../../../shared/src/business/entities/User';
import { applicationContext } from '../../applicationContext';
import { dashboardExternalHelper as dashboardExternalHelperComputed } from './dashboardExternalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const dashboardExternalHelper = withAppContextDecorator(
  dashboardExternalHelperComputed,
  applicationContext,
);

describe('petitioner dashboard helper', () => {
  it('shows "what to expect" but not case list when there are no cases', () => {
    applicationContext.getCurrentUser = () => ({
      role: User.ROLES.petitioner,
    });
    const result = runCompute(dashboardExternalHelper, {
      state: {
        cases: [],
      },
    });
    expect(result.showCaseList).toEqual(false);
    expect(result.showWhatToExpect).toEqual(true);
    expect(result.showCaseSearch).toEqual(false);
  });
  it('shows case list but not "what to expect" when there is a case', () => {
    applicationContext.getCurrentUser = () => ({
      role: User.ROLES.petitioner,
    });
    const result = runCompute(dashboardExternalHelper, {
      state: {
        cases: [{ something: true }],
      },
    });
    expect(result.showCaseList).toEqual(true);
    expect(result.showWhatToExpect).toEqual(false);
    expect(result.showCaseSearch).toEqual(false);
  });
  it('shows case search if defined user has privatePractitioner role', () => {
    applicationContext.getCurrentUser = () => ({
      role: User.ROLES.privatePractitioner,
    });
    const result = runCompute(dashboardExternalHelper, {
      state: {
        cases: [{ something: true }],
      },
    });
    expect(result.showCaseList).toEqual(true);
    expect(result.showWhatToExpect).toEqual(false);
    expect(result.showCaseSearch).toEqual(true);
  });

  it('shows case search if defined user has irsPractitioner role', () => {
    applicationContext.getCurrentUser = () => ({
      role: User.ROLES.irsPractitioner,
    });
    const result = runCompute(dashboardExternalHelper, {
      state: {
        cases: [{ something: true }],
      },
    });
    expect(result.showCaseList).toEqual(true);
    expect(result.showWhatToExpect).toEqual(false);
    expect(result.showCaseSearch).toEqual(true);
  });

  it('hides case search if defined user does not have privatePractitioner or irsPractitioner role', () => {
    applicationContext.getCurrentUser = () => ({
      role: User.ROLES.petitionsClerk,
    });
    const result = runCompute(dashboardExternalHelper, {
      state: {
        cases: [{ something: true }],
      },
    });
    expect(result.showCaseList).toEqual(true);
    expect(result.showWhatToExpect).toEqual(false);
    expect(result.showCaseSearch).toEqual(false);
  });
});
