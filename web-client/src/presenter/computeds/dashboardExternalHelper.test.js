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
  it('shows case search if defined user has practitioner role', () => {
    applicationContext.getCurrentUser = () => ({
      role: User.ROLES.practitioner,
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

  it('shows case search if defined user has respondent role', () => {
    applicationContext.getCurrentUser = () => ({
      role: User.ROLES.respondent,
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

  it('hides case search if defined user does not have practitioner or respondent role', () => {
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
