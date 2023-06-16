import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { dashboardExternalHelper as dashboardExternalHelperComputed } from './dashboardExternalHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const dashboardExternalHelper = withAppContextDecorator(
  dashboardExternalHelperComputed,
  applicationContext,
);

describe('dashboardExternalHelper', () => {
  it('should show "what to expect" but not case list when there are no open or closed cases', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.petitioner,
    });
    const result = runCompute(dashboardExternalHelper, {
      state: {
        closedCases: [],
        openCases: [],
      },
    });
    expect(result.showWhatToExpect).toEqual(true);
  });

  it('should show case list but not "what to expect" when there is an open or closed case case', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.petitioner,
    });
    const result = runCompute(dashboardExternalHelper, {
      state: {
        closedCases: [{ something: true }],
        openCases: [{ something: true }],
      },
    });
    expect(result.showWhatToExpect).toEqual(false);
  });

  it('should keep the showFileACase flag as false when the user role is petitioner', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.petitioner,
    });

    const result = runCompute(dashboardExternalHelper, {
      state: {
        closedCases: [{ something: true }],
        openCases: [{ something: true }],
      },
    });

    expect(result.showFileACase).toEqual(false);
  });

  it('should set the showFileACase flag as true when the user role is a private practitioner', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.privatePractitioner,
    });

    const result = runCompute(dashboardExternalHelper, {
      state: {
        closedCases: [{ something: true }],
        openCases: [{ something: true }],
      },
    });

    expect(result.showFileACase).toEqual(true);
  });

  it('should keep the showStartButton flag as false when the user role is irs practitioner', () => {
    applicationContext.getCurrentUser = () => ({
      role: ROLES.irsPractitioner,
    });

    const result = runCompute(dashboardExternalHelper, {
      state: {
        closedCases: [{ something: true }],
        openCases: [{ something: true }],
      },
    });

    expect(result.showStartButton).toEqual(false);
  });

  it('should set the showStartButton flag as true when the user role is a private practitioner or petitioner', () => {
    const userRoles = ['petitioner', 'privatePractitioner'];

    userRoles.forEach(userRole => {
      applicationContext.getCurrentUser = () => ({
        role: userRole,
      });

      const result = runCompute(dashboardExternalHelper, {
        state: {
          closedCases: [{ something: true }],
          openCases: [{ something: true }],
        },
      });

      expect(result.showStartButton).toEqual(true);
    });
  });
});
