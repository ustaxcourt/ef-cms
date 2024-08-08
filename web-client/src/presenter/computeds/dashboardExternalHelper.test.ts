import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { applicationContext } from '../../applicationContext';
import { dashboardExternalHelper as dashboardExternalHelperComputed } from './dashboardExternalHelper';
import {
  docketClerk1User,
  petitionerUser,
  privatePractitionerUser,
} from '@shared/test/mockUsers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('dashboardExternalHelper', () => {
  const dashboardExternalHelper = withAppContextDecorator(
    dashboardExternalHelperComputed,
    applicationContext,
  );

  it('should show "what to expect" but not case list when there are no open or closed cases', () => {
    applicationContext.getCurrentUser = () =>
      ({
        role: ROLES.petitioner,
      }) as RawUser;
    const result = runCompute(dashboardExternalHelper, {
      state: {
        closedCases: [],
        openCases: [],
      },
    });
    expect(result.showPetitionWelcomePage).toEqual(true);
  });

  it('should show case list but not "what to expect" when there is an open or closed case case', () => {
    applicationContext.getCurrentUser = () =>
      ({
        role: ROLES.petitioner,
      }) as RawUser;
    const result = runCompute(dashboardExternalHelper, {
      state: {
        closedCases: [{ something: true }],
        openCases: [{ something: true }],
      },
    });
    expect(result.showPetitionWelcomePage).toEqual(false);
  });

  it('should keep the showStartButton flag as false when the user role is irs practitioner', () => {
    applicationContext.getCurrentUser = () =>
      ({
        role: ROLES.irsPractitioner,
      }) as RawUser;

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
      applicationContext.getCurrentUser = () =>
        ({
          role: userRole,
        }) as RawUser;

      const result = runCompute(dashboardExternalHelper, {
        state: {
          closedCases: [{ something: true }],
          openCases: [{ something: true }],
        },
      });

      expect(result.showStartButton).toEqual(true);
    });
  });

  it('should set the showFilingFee to true when the user is a private practitioner or petitioner', () => {
    const userRoles = ['petitioner', 'privatePractitioner'];

    userRoles.forEach(userRole => {
      applicationContext.getCurrentUser = () =>
        ({
          role: userRole,
        }) as RawUser;

      const result = runCompute(dashboardExternalHelper, {
        state: {
          closedCases: [{ something: true }],
          openCases: [{ something: true }],
        },
      });

      expect(result.showFilingFee).toEqual(true);
    });
  });

  it('should set the showFilingFee to false when the user is NOT a private practitioner or petitioner', () => {
    applicationContext.getCurrentUser = () => docketClerk1User;

    const result = runCompute(dashboardExternalHelper, {
      state: {
        closedCases: [{ something: true }],
        openCases: [{ something: true }],
      },
    });

    expect(result.showFilingFee).toEqual(false);
  });

  it('should set the return welcome message for private practitioner', () => {
    applicationContext.getCurrentUser = () => privatePractitionerUser;

    const result = runCompute(dashboardExternalHelper, { state: {} });

    expect(result.welcomeMessageTitle).toEqual(
      'Do you need access to an existing case?',
    );
    expect(result.welcomeMessage).toEqual(
      'Search for the case docket number to file the appropriate document.',
    );
  });

  it('should set the return welcome message for petitioner', () => {
    applicationContext.getCurrentUser = () => petitionerUser;

    const result = runCompute(dashboardExternalHelper, { state: {} });

    expect(result.welcomeMessageTitle).toEqual(
      'Have you already filed a petition by mail or do you want electronic access to your existing case?',
    );
    expect(result.welcomeMessage).toContain(
      'Do not start a new case. Email <a href="mailto:dawson.support@ustaxcourt.gov"> dawson.support@ustaxcourt.gov </a> with your case\'s docket number (e.g. 12345-67) to get access to your existing case.',
    );
  });
});
